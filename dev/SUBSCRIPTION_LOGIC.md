# Subscriptions

The payment logic that I implemented with Stripe is a bit complicated, so this doc will help me detail all possible customer payment flows.

C = customer

CE = Community Edition

PE = Professional Edition

EE = Enterprise Edition

## Scenario Analysis

### Scenarios Triggers

1. C doesn't buy PE/EE after trial ends.
2. C buys PE/EE immediately after trial ends.
3. C buys PE/EE n days after trial ends.
4. C buys PE/EE while trial is ongoing.
5. C cancels PE/EE midway through billing cycle.

### Scenario Responses

1. Trial is cancelled and user is downgraded to CE.
2. New subscription is cut and trial is cancelled.
3. New subscription is cut. Trial is already cancelled.
4. Trial is cancelled and new subscription is cut.
5. Subscription is set to cancel at end of cycle.

## Events

### [Webhook] `customer.subscription.created`

#### Triggers

- customer buys new subscription
- customer signs up and trial subscription is created

#### What happens?

- cancel all **other** active subscriptions.
- update account type to subscription's corresponding edition
- send welcome/trial email to user and invoice.

### [Webhook] `customer.subscription.deleted`

#### Triggers

- customer buys new subscription and old active subscriptions are cancelled
- normal subscription expires and is cancelled
- trial expires and is cancelled

#### What happens?

- do nothing
- send goodbye email confirming subscription cancellation and downgrade tier
- send trial ended and renewal email and downgrade tier

### [Webhook] `customer.subscription.trial_will_end`

#### Triggers

- sent 3 days before trial ends

#### What happens?

- send email to customer asking if they'd like to renew

### [API] `/cancel-subscription`

#### Triggers

- triggered by customer from client side

#### What happens?

- if there's an active subscription, update to end at cancel subscription at end of billing cycle

## Testing all scenarios

- [X] C doesn't buy PE/EE after trial ends.
- [X] C buys PE/EE immediately after trial ends.
- [X] C buys PE/EE n days after trial ends.
- [X] C buys PE/EE while trial is ongoing.
- [X] C cancels PE/EE midway through billing cycle.
- [X] Trial ends and customer is downgraded.
