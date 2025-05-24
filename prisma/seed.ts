import { PrismaClient, Prisma, Role, UserRole } from "../lib/generated/prisma";

const prisma = new PrismaClient();

const userData: Prisma.UsersCreateInput[] = [
    {
        name: "Rex",
        role: UserRole.ADMIN,
    },
    {
        name: "Josey",
        role: UserRole.USER,
    }
]

const metricData: Prisma.MetricsCreateInput[] = [
  {
    "name": "Metric 1",
    "definition": "Description 1",
  },
  {
    "name": "Metric 2",
    "definition": "Description 2",
  }
]

const mockConversations = [
  {
    id: "conv-001",
    messages: [
      { role: Role.user, content: "Hi, I'm having trouble with my recent order. It's been a week and I haven't received any shipping confirmation." },
      { role: Role.assistant, content: "Hello! I'm sorry to hear about the delay with your order. Let me look into this for you. Could you please provide your order number?" },
      { role: Role.user, content: "Sure, it's ORD-12345." },
      { role: Role.assistant, content: "Thank you for providing that. I can see your order in our system. It looks like there was a delay in processing due to an inventory issue. I apologize for the inconvenience." },
      { role: Role.user, content: "I see. When can I expect it to ship?" },
      { role: Role.assistant, content: "I've checked with our warehouse team, and your order will be shipped within the next 24 hours. You'll receive a shipping confirmation email with tracking information. As a token of our apology, I've applied a 10% discount to your next purchase." },
      { role: Role.user, content: "That's great, thank you for your help!" },
      { role: Role.assistant, content: "You're welcome! Is there anything else I can assist you with today?" },
      { role: Role.user, content: "No, that's all. Thanks again." },
      { role: Role.assistant, content: "Thank you for your patience. Have a wonderful day!" },
    ]
  },
  {
    id: "conv-002",
    messages: [
      { role: Role.user, content: "I need to cancel my subscription immediately. I've been trying for days and your website keeps giving me errors." },
      { role: Role.assistant, content: "I can help you with that. What's your account email?" },
      { role: Role.user, content: "It's customer@example.com" },
      { role: Role.assistant, content: "Thanks. I'm looking at your account now." },
      { role: Role.user, content: "This is ridiculous. I've been a customer for 2 years and now I can't even cancel when I want to." },
      { role: Role.assistant, content: "I understand your frustration. I've cancelled your subscription effective immediately. You'll receive a confirmation email shortly." },
      { role: Role.user, content: "Finally. Will I get a refund for this month?" },
      { role: Role.assistant, content: "Since you're only a few days into the billing cycle, yes, we'll process a prorated refund. It should appear on your account within 3-5 business days." },
      { role: Role.user, content: "OK, thanks for handling this." },
    ]
  },
  {
    id: "conv-003",
    messages: [
      { role: Role.user, content: "Hello, I'm interested in upgrading my current plan. Could you tell me more about the premium features?" },
      { role: Role.assistant, content: "Hello! I'd be happy to help you with information about our premium plan. The premium plan includes unlimited storage, priority customer support, and advanced analytics. Is there a specific feature you're most interested in?" },
      { role: Role.user, content: "I'm mainly interested in the analytics. What kind of insights would I get?" },
      { role: Role.assistant, content: "Great question! Our advanced analytics provide detailed user behavior tracking, conversion funnel analysis, and custom report generation. You can also set up automated alerts based on specific metrics." },
      { role: Role.user, content: "That sounds useful. How much more would it cost compared to my current basic plan?" },
      { role: Role.assistant, content: "The premium plan is $29.99 per month, which is a $15 increase from your current plan. However, we're currently running a promotion where you can get the first 3 months at 50% off if you upgrade today." },
      { role: Role.user, content: "That's a good deal. Is there a yearly payment option with a discount?" },
      { role: Role.assistant, content: "Yes, we offer an annual plan at $299.90, which gives you two months free compared to the monthly rate. And with the current promotion, your first year would be $239.92, saving you even more." },
      { role: Role.user, content: "Perfect, I'd like to go with the annual plan then." },
      { role: Role.assistant, content: "Excellent choice! I'll process the upgrade right away. You'll receive a confirmation email with all the details, and your premium features will be activated immediately. Is there anything else you'd like to know about the premium features?" },
      { role: Role.user, content: "No, that covers everything. Thanks for your help!" },
      { role: Role.assistant, content: "You're welcome! Thank you for upgrading to our premium plan. If you have any questions once you start exploring the new features, don't hesitate to reach out. Have a great day!" },
    ],
  },
];


export async function main() {
  await prisma.annotation.deleteMany();
  await prisma.conversationMessages.deleteMany();
  await prisma.conversations.deleteMany();
  await prisma.metrics.deleteMany();
  await prisma.users.deleteMany();

  for (const u of userData) {
    await prisma.users.create({ data: u });
  }
  for (const m of metricData) {
    await prisma.metrics.create({ data: m });
  }
  for (const conv of mockConversations) {
    const conversation = await prisma.conversations.create({
      data: {
        id: conv.id,
        ConversationMessages: {
          create: conv.messages.map((message, idx) => ({
            turnNumber: idx + 1,
            role: message.role,
            content: message.content,
          })),
        },
      },
    });
    console.log(`Created conversation with ID: ${conversation.id}`);
  }
}

main();