import { model, Schema } from "mongoose";

const listingSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: {
    type: { filename: String, url: String },
    default: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1493612276216-ee392a5d4b91?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  },
  price: { type: Number, required: true },
  country: { type: String, required: true },
  location: { type: String, required: true },
});

const listing = model("listing", listingSchema);
export default listing;
