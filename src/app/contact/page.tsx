import { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact Support",
  description: "Send enquiries, questions, and feedback to the PlayNest gaming team.",
};

export default function ContactPage() {
  return <ContactForm />;
}
