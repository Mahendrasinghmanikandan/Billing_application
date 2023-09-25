import mongoose from 'mongoose';

const billsSchema = new mongoose.Schema(
    {
        company_name: {
            type: String,
            require: true,
        },
        company_address: {
            type: String,
            require: true,
        },
        delivery_terms: {
            type: String,
            require: true,
        },
        destination: {
            type: String,
            require: true,
        },
        dispatch: {
            type: String,
            require: true,
        },
        gstin: {
            type: String,
            require: true,
        },
        invoice_date: {
            type: String,
            require: true,
        },
        invoice_number: {
            type: String,
            require: true,
        },
        itc: {
            type: String,
            require: true,
        },
        items: {
            type: Array,
            require: true,
        },
        payment_mode: {
            type: String,
            require: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose?.models?.bills || mongoose.model("bills", billsSchema);
