import mongoose from 'mongoose';


const companySchema = mongoose.Schema({
    companyName: { type: String, required: true },
    contactNumber: { type: String },
    email: { type: String },
    description: { type: String },
    servicesOffered: [{
        serviceName: { type: String, required: true },
        description: { type: String }
    }],

    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    owner_name: { type: String },
    owner_surname: { type: String },
    address: {
        streetName: { type: String },
        town: { type: String },
        city: { type: String },
        province: { type: String },
        zipCode: { type: String }
    },
    socialLinks: {
        website: { type: String },
        facebook: { type: String },
        twitter: { type: String },
        linkedIn: { type: String },
        instagram: { type: String },
        whatsApp: { type: String}
    },
    banner: { 
        type: String,
        default: 'https://res.cloudinary.com/dxkufsejm/image/upload/v1626820000/placeholder.jpg'
    },
    profilePicture: { 
        type: String,
        default: 'https://res.cloudinary.com/dxkufsejm/image/upload/v1626820000/placeholder.jpg'},
    images: [{ 
        type: String,
        default: 'https://res.cloudinary.com/dxkufsejm/image/upload/v1626820000/placeholder.jpg'
    }],
    attachments: [{ 
        filename: { type: String, required: true },
        url: { type: String, required: true }
    }]
}, { timestamps: true });

const Company = mongoose.model('Company', companySchema);

export default Company;