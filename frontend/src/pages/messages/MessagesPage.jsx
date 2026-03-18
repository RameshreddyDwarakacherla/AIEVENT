import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Box, Typography, Avatar, TextField, IconButton,
  Badge, Chip, InputAdornment, Tooltip, CircularProgress,
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { api } from '../../lib/api';
import { toast } from 'react-toastify';
import { joinConversation, leaveConversation, emitTyping, onSocketEvent } from '../../services/socketService';
import SendIcon from '@mui/icons-material/Send';
import SearchIcon from '@mui/icons-material/Search';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import CheckIcon from '@mui/icons-material/Check';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import MessageIcon from '@mui/icons-material/Message';
import AddIcon from '@mui/icons-material/Add';
import PhoneIcon from '@mui/icons-material/Phone';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';

/* ── helpers ─────────────────────────────────────── */
const formatTime = (ts) => {
  const diff = Date.now() - new Date(ts).getTime();
  if (diff < 60000) return 'Just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`;
  return new Date(ts).toLocaleDateString();
};

const fmtMsg = (ts) =>
  new Date(ts).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

const avatarGrad = (char = 'A') => {
  const gs = [
    'linear-gradient(135deg, #2E7D32, #43A047)',  // Primary green
    'linear-gradient(135deg, #1B5E20, #2E7D32)',  // Dark green
    'linear-gradient(135deg, #43A047, #66BB6A)',  // Medium green
    'linear-gradient(135deg, #388E3C, #4CAF50)',  // Balanced green
    'linear-gradient(135deg, #2E7D32, #66BB6A)',  // Light green
  ];
  return gs[char.charCodeAt(0) % gs.length];
};

const getUserDisplayName = (u) => {
  if (!u) return 'Unknown';
  if (u.firstName || u.lastName) return `${u.firstName || ''} ${u.lastName || ''}`.trim();
  return u.email?.split('@')[0] || 'User';
};

const getInitial = (u) => getUserDisplayName(u)?.[0]?.toUpperCase() || '?';

/* ════════════════════════════════════════════════ */
const MessagesPage = () => {
  const { user, userRole } = useAuth();
  const { isUserOnline } = useApp();
  const location = useLocation();

  const [conversations, setConversations] = useState([]);
  const [selectedConv, setSelectedConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingConvs, setLoadingConvs] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [remoteTyping, setRemoteTyping] = useState(false);

  const messagesEndRef = useRef(null);
  const typingTimer = useRef(null);

  /* ── Load conversations ─────────────────────── */
  const fetchConversations = useCallback(async () => {
    if (!user) return;
    try {
      const res = await api.get('/messages/conversations');
      setConversations(res?.data || []);
    } catch {
      // fallback to an empty list
    } finally {
      setLoadingConvs(false);
    }
  }, [user]);

  useEffect(() => { fetchConversations(); }, [fetchConversations]);

  /* ── Handle preselected user ───────────────── */
  useEffect(() => {
    if (!user || loadingConvs || !location.state?.preselectUserId) return;

    const preUserId = location.state.preselectUserId;
    const preUserName = location.state.preselectUserName || 'User';

    // Check if we already have a conversation with this person
    const existing = conversations.find(c => 
      c.otherUser?.id?.toString() === preUserId?.toString() ||
      c.otherUser?._id?.toString() === preUserId?.toString()
    );

    if (existing) {
      setSelectedConv(existing);
    } else {
      // Create a mock conversation for the UI until a message is sent
      const myId = user.id || user._id;
      const ids = [myId.toString(), preUserId.toString()].sort();
      const conversationId = `conv_${ids[0]}_${ids[1]}`;

      const mockConv = {
        conversationId,
        otherUser: {
          id: preUserId,
          _id: preUserId,
          firstName: preUserName,
          lastName: '',
          email: '',
          role: userRole === 'vendor' ? 'user' : 'vendor'
        },
        lastMessage: '',
        unreadCount: 0
      };

      // Prefill conversation list if it's not there
      setConversations(prev => {
        if (prev.find(c => c.conversationId === conversationId)) return prev;
        return [mockConv, ...prev];
      });
      setSelectedConv(mockConv);
    }
    
    // Clear state after handling so it doesn't re-trigger on refresh/back
    window.history.replaceState({}, document.title);
  }, [user, loadingConvs, location.state, conversations, userRole]);

  /* ── Socket.IO live message listener ───────── */
  useEffect(() => {
    const cleanup = onSocketEvent('new_message', (msg) => {
      // Update conversation list preview
      setConversations((prev) =>
        prev.map((c) =>
          c.conversationId === msg.conversationId
            ? { ...c, lastMessage: msg.message, lastMessageTime: msg.createdAt }
            : c
        )
      );
      // Append to current chat if open
      if (selectedConv?.conversationId === msg.conversationId) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    const cleanupTyping = onSocketEvent('typing_status', ({ userId: tId, isTyping }) => {
      if (user && tId !== (user.id || user._id)) {
        setRemoteTyping(isTyping);
      }
    });

    return () => { cleanup(); cleanupTyping(); };
  }, [selectedConv, user]);

  /* ── Load messages for selected conversation ─ */
  useEffect(() => {
    if (!selectedConv) return;

    const load = async () => {
      setLoadingMsgs(true);
      try {
        const res = await api.get(`/messages/${selectedConv.conversationId}`);
        setMessages(res?.data || []);
      } catch {
        setMessages([]);
      } finally {
        setLoadingMsgs(false);
      }
    };

    load();
    joinConversation(selectedConv.conversationId);

    return () => {
      if (selectedConv) leaveConversation(selectedConv.conversationId);
    };
  }, [selectedConv]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  /* ── Handlers ────────────────────────────────── */
  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
    if (selectedConv && user) {
      emitTyping(selectedConv.conversationId, user.id || user._id, true);
      clearTimeout(typingTimer.current);
      typingTimer.current = setTimeout(
        () => emitTyping(selectedConv.conversationId, user.id || user._id, false),
        1500
      );
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConv) return;
    const text = newMessage.trim();
    setNewMessage('');

    try {
      const res = await api.post('/messages', {
        recipientId: selectedConv.otherUser.id,
        message: text,
      });
      const sent = res?.data;
      if (sent) {
        setMessages((prev) => [...prev, sent]);
        setConversations((prev) => {
          const exists = prev.some(c => c.conversationId === selectedConv.conversationId);
          if (exists) {
            return prev.map((c) =>
              c.conversationId === selectedConv.conversationId
                ? { ...c, lastMessage: text, lastMessageTime: new Date().toISOString() }
                : c
            );
          } else {
            // New conversation effectively created/confirmed
            return [
              { ...selectedConv, lastMessage: text, lastMessageTime: new Date().toISOString() },
              ...prev
            ];
          }
        });
      }
    } catch (err) {
      console.error('Send error:', err);
      toast.error('Failed to send message');
      setNewMessage(text); // restore
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const filtered = conversations.filter((c) => {
    const name = getUserDisplayName(c.otherUser).toLowerCase();
    return name.includes(searchQuery.toLowerCase());
  });

  const glass = {
    background: 'rgba(255,255,255,0.04)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,0.08)',
  };

  const myId = user?.id || user?._id;

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0d1117 0%, #1a0533 40%, #0d1117 100%)',
      p: { xs: 0, md: 3 },
      display: 'flex', flexDirection: 'column',
      fontFamily: '"Inter","Roboto",sans-serif',
      width: '100%', boxSizing: 'border-box',
    }}>
      {/* Decorative orbs */}
      {[{sz:340,t:-80,l:-80,c:'rgba(139,92,246,0.12)'},{sz:260,b:-60,r:-60,c:'rgba(236,72,153,0.09)'}].map((o,i)=>(
        <Box key={i} sx={{ position:'fixed', borderRadius:'50%', background:o.c, width:o.sz, height:o.sz, top:o.t, left:o.l, right:o.r, bottom:o.b, filter:'blur(60px)', pointerEvents:'none', zIndex:0 }}/>
      ))}

      <Box sx={{ position:'relative', zIndex:1, height:{ xs:'100vh', md:'calc(100vh - 48px)' }, display:'flex', flexDirection:'column', overflow:'hidden', borderRadius:{ xs:0, md:4 }, ...glass }}>

        {/* Top header */}
        <Box sx={{ px:3, py:2, borderBottom:'1px solid rgba(255,255,255,0.07)', background:'rgba(0,0,0,0.2)', display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0 }}>
          <Box>
            <Typography sx={{ fontWeight:800, fontSize:'1.3rem', color:'white', letterSpacing:'-0.02em' }}>Messages</Typography>
            <Typography sx={{ color:'rgba(255,255,255,0.35)', fontSize:'0.78rem' }}>
              Chat with {userRole === 'vendor' ? 'clients' : 'vendors'} · {conversations.length} conversations
            </Typography>
          </Box>
          <Tooltip title="New conversation">
            <IconButton sx={{ color:'rgba(255,255,255,0.5)', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', '&:hover':{ color:'white', background:'rgba(139,92,246,0.2)' } }}>
              <AddIcon fontSize="small"/>
            </IconButton>
          </Tooltip>
        </Box>

        {/* Body */}
        <Box sx={{ display:'flex', flex:1, overflow:'hidden' }}>

          {/* Conversations sidebar */}
          <Box sx={{
            width:{ xs: selectedConv ? 0 : '100%', md: 310 },
            minWidth:{ md: 310 },
            display:{ xs: selectedConv ? 'none' : 'flex', md: 'flex' },
            flexDirection:'column',
            borderRight:'1px solid rgba(255,255,255,0.07)',
            overflow:'hidden',
          }}>
            {/* Search */}
            <Box sx={{ p:2, borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
              <TextField
                fullWidth size="small"
                placeholder="Search…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color:'rgba(255,255,255,0.3)', fontSize:18 }}/></InputAdornment> }}
                sx={{
                  '& .MuiOutlinedInput-root': { color:'rgba(255,255,255,0.85)', borderRadius:'12px', background:'rgba(255,255,255,0.06)', '& fieldset':{ borderColor:'rgba(255,255,255,0.1)' }, '&:hover fieldset':{ borderColor:'rgba(139,92,246,0.4)' }, '&.Mui-focused fieldset':{ borderColor:'#8B5CF6' } },
                  '& input::placeholder':{ color:'rgba(255,255,255,0.3)', opacity:1 },
                }}
              />
            </Box>

            {/* List */}
            <Box sx={{ flex:1, overflowY:'auto', '&::-webkit-scrollbar':{ width:4 }, '&::-webkit-scrollbar-thumb':{ background:'rgba(255,255,255,0.1)', borderRadius:4 } }}>
              {loadingConvs ? (
                <Box sx={{ display:'flex', justifyContent:'center', py:6 }}><CircularProgress sx={{ color:'#8B5CF6' }} size={32}/></Box>
              ) : filtered.length === 0 ? (
                <Box sx={{ py:6, textAlign:'center' }}>
                  <MessageIcon sx={{ fontSize:40, color:'rgba(255,255,255,0.15)', mb:1 }}/>
                  <Typography sx={{ color:'rgba(255,255,255,0.3)', fontSize:'0.85rem' }}>No conversations yet</Typography>
                </Box>
              ) : filtered.map((conv, idx) => {
                const isActive = selectedConv?.conversationId === conv.conversationId;
                const online = isUserOnline(conv.otherUser?.id);
                const name = getUserDisplayName(conv.otherUser);
                const initial = getInitial(conv.otherUser);
                return (
                  <Box key={conv.conversationId} onClick={() => setSelectedConv(conv)} sx={{
                    display:'flex', alignItems:'center', gap:1.5, px:2, py:1.8, cursor:'pointer',
                    borderLeft:`3px solid ${isActive ? '#8B5CF6' : 'transparent'}`,
                    background: isActive ? 'rgba(139,92,246,0.12)' : 'transparent',
                    transition:'all 0.18s ease',
                    animation:`slideIn 0.3s ease-out ${idx * 0.05}s both`,
                    '@keyframes slideIn':{ from:{ opacity:0, transform:'translateX(-12px)' }, to:{ opacity:1, transform:'translateX(0)' } },
                    '&:hover':{ background: isActive ? 'rgba(139,92,246,0.15)' : 'rgba(255,255,255,0.04)' },
                  }}>
                    <Box sx={{ position:'relative', flexShrink:0 }}>
                      <Badge badgeContent={conv.unreadCount > 0 ? conv.unreadCount : null} color="error" sx={{ '& .MuiBadge-badge':{ fontSize:'0.65rem', minWidth:16, height:16 } }}>
                        <Avatar sx={{ width:42, height:42, background:avatarGrad(initial), fontWeight:700, fontSize:'1rem' }}>{initial}</Avatar>
                      </Badge>
                      {online && (
                        <Box sx={{ position:'absolute', bottom:1, right:1, width:10, height:10, borderRadius:'50%', background:'#10B981', border:'2px solid #0d1117', animation:'pulse 2s ease-in-out infinite', '@keyframes pulse':{ '0%,100%':{ opacity:1 }, '50%':{ opacity:0.5 } } }}/>
                      )}
                    </Box>

                    <Box sx={{ flex:1, minWidth:0 }}>
                      <Box sx={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', mb:0.3 }}>
                        <Typography sx={{ fontWeight:conv.unreadCount>0?700:600, fontSize:'0.9rem', color:'rgba(255,255,255,0.9)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', maxWidth:140 }}>
                          {name}
                        </Typography>
                        <Typography sx={{ fontSize:'0.68rem', color:'rgba(255,255,255,0.3)', ml:1, flexShrink:0 }}>
                          {conv.lastMessageTime ? formatTime(conv.lastMessageTime) : ''}
                        </Typography>
                      </Box>
                      <Typography sx={{ fontSize:'0.78rem', color:'rgba(255,255,255,0.35)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', fontWeight:conv.unreadCount>0?600:400 }}>
                        {conv.lastMessage}
                      </Typography>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </Box>

          {/* Chat panel */}
          <Box sx={{ flex:1, display:{ xs: selectedConv?'flex':'none', md:'flex' }, flexDirection:'column', overflow:'hidden', minWidth:0 }}>
            {selectedConv ? (
              <>
                {/* Chat header */}
                <Box sx={{ px:2.5, py:1.5, flexShrink:0, borderBottom:'1px solid rgba(255,255,255,0.07)', background:'rgba(0,0,0,0.15)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                  <Box sx={{ display:'flex', alignItems:'center', gap:1.5 }}>
                    <IconButton size="small" onClick={() => setSelectedConv(null)} sx={{ display:{ md:'none' }, color:'rgba(255,255,255,0.6)', mr:0.5 }}>
                      <KeyboardArrowLeftIcon/>
                    </IconButton>
                    <Box sx={{ position:'relative' }}>
                      <Avatar sx={{ width:40, height:40, background:avatarGrad(getInitial(selectedConv.otherUser)), fontWeight:700 }}>
                        {getInitial(selectedConv.otherUser)}
                      </Avatar>
                      {isUserOnline(selectedConv.otherUser?.id) && (
                        <Box sx={{ position:'absolute', bottom:1, right:1, width:9, height:9, borderRadius:'50%', background:'#10B981', border:'2px solid #0d1117' }}/>
                      )}
                    </Box>
                    <Box>
                      <Typography sx={{ fontWeight:700, color:'white', fontSize:'0.95rem', lineHeight:1.2 }}>
                        {getUserDisplayName(selectedConv.otherUser)}
                      </Typography>
                      <Box sx={{ display:'flex', alignItems:'center', gap:0.6 }}>
                        <Box sx={{ width:6, height:6, borderRadius:'50%', background: isUserOnline(selectedConv.otherUser?.id) ? '#10B981' : 'rgba(255,255,255,0.2)' }}/>
                        <Typography sx={{ fontSize:'0.72rem', color: isUserOnline(selectedConv.otherUser?.id) ? '#10B981' : 'rgba(255,255,255,0.35)' }}>
                          {isUserOnline(selectedConv.otherUser?.id) ? 'Online' : 'Offline'}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  <Box sx={{ display:'flex', gap:0.5 }}>
                    {[<PhoneIcon/>, <VideoCallIcon/>, <MoreVertIcon/>].map((icon, i) => (
                      <Tooltip key={i} title={['Call','Video','More'][i]}>
                        <IconButton size="small" sx={{ color:'rgba(255,255,255,0.45)', '&:hover':{ color:'white', background:'rgba(255,255,255,0.08)' }, borderRadius:2 }}>
                          {icon}
                        </IconButton>
                      </Tooltip>
                    ))}
                  </Box>
                </Box>

                {/* Messages area */}
                <Box sx={{ flex:1, overflowY:'auto', px:{ xs:2, md:3 }, py:2.5, display:'flex', flexDirection:'column', gap:1.5, '&::-webkit-scrollbar':{ width:4 }, '&::-webkit-scrollbar-thumb':{ background:'rgba(255,255,255,0.1)', borderRadius:4 } }}>
                  {loadingMsgs ? (
                    <Box sx={{ display:'flex', justifyContent:'center', py:6 }}><CircularProgress sx={{ color:'#8B5CF6' }} size={28}/></Box>
                  ) : messages.map((msg, i) => {
                    const senderId = msg.senderId?._id || msg.senderId;
                    const isOwn = senderId?.toString() === myId?.toString();
                    return (
                      <Box key={msg._id || i} sx={{
                        display:'flex', justifyContent: isOwn ? 'flex-end' : 'flex-start',
                        animation:`msgIn 0.25s ease-out ${i * 0.03}s both`,
                        '@keyframes msgIn':{ from:{ opacity:0, transform:'translateY(8px) scale(0.97)' }, to:{ opacity:1, transform:'translateY(0) scale(1)' } },
                      }}>
                        {!isOwn && (
                          <Avatar sx={{ width:32, height:32, background:avatarGrad(getInitial(selectedConv.otherUser)), fontSize:'0.8rem', fontWeight:700, mr:1, mt:0.5, flexShrink:0 }}>
                            {getInitial(selectedConv.otherUser)}
                          </Avatar>
                        )}
                        <Box sx={{ maxWidth:'68%', display:'flex', flexDirection:'column', alignItems: isOwn ? 'flex-end' : 'flex-start', gap:0.4 }}>
                          <Box sx={{
                            px:2, py:1.3,
                            borderRadius: isOwn ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                            background: isOwn ? 'linear-gradient(135deg,#8B5CF6,#7C3AED)' : 'rgba(255,255,255,0.08)',
                            border: isOwn ? 'none' : '1px solid rgba(255,255,255,0.1)',
                            boxShadow: isOwn ? '0 4px 20px rgba(139,92,246,0.35)' : 'none',
                            '&:hover':{ transform:'scale(1.01)' }, transition:'transform 0.15s ease',
                          }}>
                            <Typography sx={{ fontSize:'0.9rem', color:'rgba(255,255,255,0.9)', lineHeight:1.55, whiteSpace:'pre-wrap' }}>
                              {msg.message}
                            </Typography>
                          </Box>
                          <Box sx={{ display:'flex', alignItems:'center', gap:0.5, px:0.5 }}>
                            <Typography sx={{ fontSize:'0.68rem', color:'rgba(255,255,255,0.25)' }}>
                              {fmtMsg(msg.createdAt || msg.timestamp)}
                            </Typography>
                            {isOwn && (msg.isRead
                              ? <DoneAllIcon sx={{ fontSize:12, color:'#8B5CF6' }}/>
                              : <CheckIcon sx={{ fontSize:12, color:'rgba(255,255,255,0.3)' }}/>
                            )}
                          </Box>
                        </Box>
                        {isOwn && (
                          <Avatar sx={{ width:32, height:32, background:'linear-gradient(135deg,#6D28D9,#EC4899)', fontSize:'0.8rem', fontWeight:700, ml:1, mt:0.5, flexShrink:0 }}>
                            {(user?.email?.[0] || 'U').toUpperCase()}
                          </Avatar>
                        )}
                      </Box>
                    );
                  })}

                  {/* Typing indicator */}
                  {remoteTyping && (
                    <Box sx={{ display:'flex', alignItems:'center', gap:1, pl:1 }}>
                      <Avatar sx={{ width:28, height:28, background:avatarGrad(getInitial(selectedConv.otherUser)), fontSize:'0.75rem', fontWeight:700 }}>
                        {getInitial(selectedConv.otherUser)}
                      </Avatar>
                      <Box sx={{ display:'flex', gap:0.5, px:2, py:1.2, background:'rgba(255,255,255,0.08)', borderRadius:'18px 18px 18px 4px', border:'1px solid rgba(255,255,255,0.1)' }}>
                        {[0,1,2].map(j => (
                          <Box key={j} sx={{ width:6, height:6, borderRadius:'50%', background:'rgba(255,255,255,0.5)', animation:`bounce 1.2s ease-in-out ${j*0.2}s infinite`, '@keyframes bounce':{ '0%,80%,100%':{ transform:'scale(0.8)', opacity:0.5 }, '40%':{ transform:'scale(1.2)', opacity:1 } } }}/>
                        ))}
                      </Box>
                    </Box>
                  )}
                  <div ref={messagesEndRef}/>
                </Box>

                {/* Input bar */}
                <Box sx={{ px:{ xs:2, md:3 }, py:2, flexShrink:0, borderTop:'1px solid rgba(255,255,255,0.07)', background:'rgba(0,0,0,0.15)' }}>
                  <Box sx={{ display:'flex', gap:1, alignItems:'flex-end', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'16px', px:1.5, py:1, transition:'border-color 0.2s', '&:focus-within':{ borderColor:'rgba(139,92,246,0.5)' } }}>
                    <Tooltip title="Attach"><IconButton size="small" sx={{ color:'rgba(255,255,255,0.35)', '&:hover':{ color:'#8B5CF6' } }}><AttachFileIcon fontSize="small"/></IconButton></Tooltip>
                    <TextField
                      fullWidth multiline maxRows={4}
                      placeholder="Type a message…"
                      value={newMessage}
                      onChange={handleInputChange}
                      onKeyDown={handleKey}
                      variant="standard"
                      InputProps={{ disableUnderline: true }}
                      sx={{ '& .MuiInputBase-root':{ color:'rgba(255,255,255,0.85)', fontSize:'0.9rem', py:0.3 }, '& textarea::placeholder':{ color:'rgba(255,255,255,0.25)', opacity:1 } }}
                    />
                    <Tooltip title="Emoji"><IconButton size="small" sx={{ color:'rgba(255,255,255,0.35)', '&:hover':{ color:'#F59E0B' } }}><EmojiEmotionsIcon fontSize="small"/></IconButton></Tooltip>
                    <IconButton
                      onClick={sendMessage}
                      disabled={!newMessage.trim()}
                      size="small"
                      sx={{
                        background: newMessage.trim() ? 'linear-gradient(135deg,#8B5CF6,#EC4899)' : 'rgba(255,255,255,0.07)',
                        color: newMessage.trim() ? 'white' : 'rgba(255,255,255,0.2)',
                        width:36, height:36, borderRadius:'12px', flexShrink:0,
                        boxShadow: newMessage.trim() ? '0 4px 14px rgba(139,92,246,0.45)' : 'none',
                        transition:'all 0.2s ease',
                        '&:hover':{ transform: newMessage.trim() ? 'scale(1.08)' : 'none' },
                        '&.Mui-disabled':{ color:'rgba(255,255,255,0.15)', background:'rgba(255,255,255,0.05)' },
                      }}
                    >
                      <SendIcon sx={{ fontSize:18 }}/>
                    </IconButton>
                  </Box>
                  <Typography sx={{ textAlign:'center', mt:0.8, fontSize:'0.68rem', color:'rgba(255,255,255,0.2)' }}>
                    Enter to send · Shift+Enter for new line
                  </Typography>
                </Box>
              </>
            ) : (
              <Box sx={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:2, p:4 }}>
                <Box sx={{
                  width:80, height:80, borderRadius:'24px',
                  background:'linear-gradient(135deg,rgba(139,92,246,0.2),rgba(236,72,153,0.15))',
                  border:'1px solid rgba(139,92,246,0.3)',
                  display:'flex', alignItems:'center', justifyContent:'center', mb:1,
                  animation:'float 3s ease-in-out infinite',
                  '@keyframes float':{ '0%,100%':{ transform:'translateY(0)' }, '50%':{ transform:'translateY(-8px)' } },
                }}>
                  <MessageIcon sx={{ fontSize:36, color:'rgba(139,92,246,0.7)' }}/>
                </Box>
                <Typography sx={{ fontWeight:700, fontSize:'1.2rem', color:'rgba(255,255,255,0.7)' }}>
                  Select a conversation
                </Typography>
                <Typography sx={{ color:'rgba(255,255,255,0.3)', fontSize:'0.85rem', textAlign:'center', maxWidth:260 }}>
                  Choose a conversation to start messaging your {userRole === 'vendor' ? 'clients' : 'vendors'}
                </Typography>
                <Chip
                  label="Start a new conversation"
                  icon={<AddIcon sx={{ fontSize:'1rem !important' }}/>}
                  sx={{ mt:1, color:'rgba(255,255,255,0.5)', background:'rgba(139,92,246,0.12)', border:'1px solid rgba(139,92,246,0.25)', '&:hover':{ background:'rgba(139,92,246,0.2)', color:'rgba(255,255,255,0.8)' }, cursor:'pointer' }}
                />
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default MessagesPage;
