import { supabase } from '../lib/api';

export const processPayment = async (bookingData, paymentMethod) => {
  try {
    
    if (!bookingData.amount || bookingData.amount <= 0) {
      throw new Error('Invalid payment amount');
    }
    
    if (!paymentMethod || !paymentMethod.id) {
      throw new Error('Invalid payment method');
    }
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const transactionId = `txn_${Math.random().toString(36).substring(2, 15)}`;
    
    const { data, error } = await supabase
      .from('payments')
      .insert({
        booking_id: bookingData.booking_id,
        event_id: bookingData.event_id,
        vendor_id: bookingData.vendor_id,
        user_id: bookingData.user_id,
        amount: bookingData.amount,
        currency: bookingData.currency || 'USD',
        payment_method: paymentMethod.type,
        payment_method_details: {
          id: paymentMethod.id,
          last4: paymentMethod.last4 || '****',
          brand: paymentMethod.brand || 'Unknown'
        },
        transaction_id: transactionId,
        status: 'completed',
        created_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw error;
    
    const { error: bookingError } = await supabase
      .from('event_vendor_bookings')
      .update({ 
        payment_status: 'paid',
        updated_at: new Date().toISOString()
      })
      .eq('id', bookingData.booking_id);
    
    if (bookingError) throw bookingError;
    
    return {
      success: true,
      payment: data,
      transactionId
    };
  } catch (error) {
    console.error('Payment processing error:', error);
    throw error;
  }
};

export const getUserPaymentMethods = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('user_payment_methods')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    return [];
  }
};

export const addPaymentMethod = async (userId, paymentMethodData) => {
  try {
    
    if (!paymentMethodData.type || !paymentMethodData.details) {
      throw new Error('Invalid payment method data');
    }
    
    const { data, error } = await supabase
      .from('user_payment_methods')
      .insert({
        user_id: userId,
        type: paymentMethodData.type,
        details: {
          last4: paymentMethodData.details.last4 || '****',
          brand: paymentMethodData.details.brand || 'Unknown',
          expMonth: paymentMethodData.details.expMonth,
          expYear: paymentMethodData.details.expYear
        },
        is_default: paymentMethodData.isDefault || false,
        created_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error adding payment method:', error);
    throw error;
  }
};

export const getUserPaymentHistory = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('payments')
      .select(`
        *,
        booking:event_vendor_bookings(
          *,
          event:events(id, title),
          vendor:vendors(id, name)
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error fetching payment history:', error);
    return [];
  }
};

export const getVendorPaymentHistory = async (vendorId) => {
  try {
    const { data, error } = await supabase
      .from('payments')
      .select(`
        *,
        booking:event_vendor_bookings(
          *,
          event:events(id, title, user_id),
          user:profiles(id, first_name, last_name)
        )
      `)
      .eq('vendor_id', vendorId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error fetching vendor payment history:', error);
    return [];
  }
};

export const issueRefund = async (paymentId, amount, reason) => {
  try {
    
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .select('*')
      .eq('id', paymentId)
      .single();
    
    if (paymentError) throw paymentError;
    
    if (!payment) {
      throw new Error('Payment not found');
    }
    
    if (payment.status !== 'completed') {
      throw new Error('Cannot refund a payment that is not completed');
    }
    
    if (!payment.amount || amount <= 0 || amount > payment.amount) {
      throw new Error('Invalid refund amount');
    }
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const refundId = `ref_${Math.random().toString(36).substring(2, 15)}`;
    
    const { data, error } = await supabase
      .from('refunds')
      .insert({
        payment_id: paymentId,
        booking_id: payment.booking_id,
        event_id: payment.event_id,
        vendor_id: payment.vendor_id,
        user_id: payment.user_id,
        amount,
        currency: payment.currency,
        reason,
        refund_id: refundId,
        status: 'completed',
        created_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw error;
    
    if (amount === payment.amount) {
      const { error: updateError } = await supabase
        .from('payments')
        .update({ 
          status: 'refunded',
          updated_at: new Date().toISOString()
        })
        .eq('id', paymentId);
      
      if (updateError) throw updateError;
    } else {
      const { error: updateError } = await supabase
        .from('payments')
        .update({ 
          status: 'partially_refunded',
          refunded_amount: amount,
          updated_at: new Date().toISOString()
        })
        .eq('id', paymentId);
      
      if (updateError) throw updateError;
    }
    
    return {
      success: true,
      refund: data,
      refundId
    };
  } catch (error) {
    console.error('Refund processing error:', error);
    throw error;
  }
};

export default {
  processPayment,
  getUserPaymentMethods,
  addPaymentMethod,
  getUserPaymentHistory,
  getVendorPaymentHistory,
  issueRefund
};
