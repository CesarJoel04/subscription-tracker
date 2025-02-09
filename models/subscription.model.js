import mysql2 from 'mysql2/promise';

const subscriptionSchema = new mysql2.Schema({ 
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        minLength: [3, 'Name must be at least 3 characters long'],
        maxLength: [50, 'Name must be at most 50 characters long'],
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price must be at least 0'],
    },
    currency: {
        type: String,
        enum : ['USD', 'EUR', 'GBP'],
        default: 'USD'
    }, 
frequency: {
        type: String,
        enum : ['daily', 'weekly', 'monthly', 'yearly'],
    },
categoty: {
    type: String,
    enum : ['entertainment', 'health', 'lifestyle', 'tech', 'other'],
    required: true,
},
paymentMethod: {
    type: String,
    required: true,
    trim: true,
},
status: {
    type: String,
    enum : ['active', 'cancelled', 'expired'],
    default: 'active'
},
startDate: {
    type: Date,
    required: true,
    validate: {
        validator: (value) => value <= new Date(),
        message: 'Start date must be in the past.'
    }
}, 
renewalDate: {
    type: Date,
    validate: {
        validator: function (value) {
            return value > this.startDate;
        },
        message: 'Renewal date must be after the start date.'
    }
},

user: {
    type: mysql2.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
}
},
    {timestamps: true});

// Auto-calculate renewal date if missing
subscriptionSchema.pre('save', function (next) {
    if (!this.renewalDate){
        const renewalPeriods = {
            daily: 1,
            weekly: 7,
            monthly: 30,
            yearly: 365
        };

        this.renewalDate = new Date(this.startDate);
        this.renewalDate.setDate(this.renewalDate.getDate() + renewalPeriods[this.frequency]);
    }

    //Auto-update the status if reneward date has passed
    if (this.renewalDate < new Date()){
        this.status = 'expired';
    }

    next();
});

const Subscription = mysql2.model('Subscription', subscriptionSchema);

export default Subscription;