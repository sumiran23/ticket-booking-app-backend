const processPayment = async (
  cardDetails: {
    cardNumber: string;
    cvv: string;
    expiry: string;
    cardholder: string;
  },
  amount: number,
) => {
  console.log("Processing payment...", { amount, cardDetails });

  // Simulate payment gateway delay (5 seconds)
  await new Promise((resolve) => setTimeout(resolve, 5000));

  return {
    success: true,
    transactionId: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    amount: amount,
  };
};

export default { processPayment };
