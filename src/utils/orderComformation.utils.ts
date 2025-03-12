// import mongoose from "mongoose";
import { sendMail } from "./sendEmail.utils";

interface IOrderDetails {
  orderId: string;
  items: any[];
  totalAmount: Number;
  // _id: mongoose.Types.ObjectId;
}
interface Ioptions {
  to: string;
  orderDetails?: IOrderDetails;
}

export const sendOrderConformationEmail = async (options: Ioptions) => {
  // const ;
  const { to, orderDetails } = options;
  const html = `
  <h1>Your order is placed sucessfully</h1>
  <p>OrderId:${orderDetails?.orderId}</p>
  <h1>Order:</h1>
  <ol>
    ${orderDetails?.items
      .map(
        (item) =>
          `<li>${item.product.name} -${item.product.price} X ${item.quantity}</li>`
      )
      .join("")}
  </ol>
  <p>Total: Rs.${orderDetails?.totalAmount.toFixed(2)}</p>
  <P>Order garnu Bhayeko ma dhanybaad.</P>
  
  `;
  const mailOption = {
    html,
    subject: "orderplaced",
    to,
  };
  await sendMail(mailOption);
};
