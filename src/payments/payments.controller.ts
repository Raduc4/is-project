import { Body, Controller, Post } from "@nestjs/common";
import Stripe from "stripe";

@Controller("payments")
export class PaymentsController {
  private stripe = new Stripe("sk_test_4eC39HqLyjWDarjtT1zdp7dc");
  constructor() {}

  @Post("/create-setup-intent")
  async createSetupIntent() {
    const customer = await this.stripe.customers.create();
    const ephemeralKey = await this.stripe.ephemeralKeys.create(
      { customer: customer.id },
      { apiVersion: "2022-08-01" }
    );
    const setupIntent = await this.stripe.setupIntents.create({
      customer: customer.id,
    });
    return {
      setupIntent: setupIntent.client_secret,
      ephemeralKey: ephemeralKey.secret,
      customer: customer.id,
    };
  }

  @Post("/")
  async createPaymentIntent(@Body() request: any) {
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: request.amount,
      currency: request.currency,
      payment_method_types: [request.gateway],
    });
    // The Handlebars template will use the parameter values to update the page with the chosen color
    return paymentIntent;
  }
}
