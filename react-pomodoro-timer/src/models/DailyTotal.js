import mongoose from 'mongoose';

const dailyTotalSchema = new mongoose.Schema({
    date: { type: Date, default: Date.now },
    totalValue: Number
  });
  
  const DailyTotal = mongoose.model('DailyTotal', dailyTotalSchema);
  
export default DailyTotal;

  