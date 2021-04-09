<p align="center">
  <a href="https://github.com/enriquebv/getskills">
    <h1>GetSkills.live</h1>
  </a>

  <p align="center">
    Bring skills to your stream using Channel Points.
    <br />
    <a href="https://getskills.live">View site</a>
  </p>
</p>

## About The Project

This project makes it easy to create experiences for your viewers using channel points. It will be used to change your scenes (Streamlabs OBS, OBS), to show animations and sounds, to create bidding systems, or even to connect to your led lights or other devices.

### Built With

- [NestJS](https://nestjs.com/)
- [Next.js](https://nextjs.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [MongoDB](https://www.mongodb.com/)

## Getting Started

To get a local copy up and running follow these simple steps.

### Prerequisites

- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)
- [Yarn 1.x](https://classic.yarnpkg.com)

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/enriquebv/getskills.git
   ```
2. Install modules
   ```sh
   yarn
   ```
3. Install packages
   ```sh
   yarn lerna bootstrap
   ```
4. Build front-end & back-end
   ```sh
   yarn lerna run build
   ```
5. Remove `.example` suffix from `/packages/backend/.env.example` file and set real values.

   ```bash
    # Stage
    APP_ENV=development
    APP_URL=http://localhost:3000

    # Security
    JWT_SECRET=123456
    ALLOWED_ORIGINS=http://localhost:8080
    ALLOWED_COOKIE_DOMAIN=localhost

    # Persistence
    MONGODB_URI=mongodb://localhost/getskillsdb

    # Misc
    APP_DEBUG=true

    TWITCH_CLIENT_ID=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX # Twitch App Client ID
    TWITCH_CLIENT_SECRET=XXXXXXXXXXXXXXXXXXXXXXXXXXXXX # Twitch App Secret
    TWITCH_WEBHOOK_SECRET=12345678910

    DISCORD_CONTACT_WEBHOOK=https://discord.com/api/webhooks/XXXXXXXXXXXXXXXXXXXXX/XXXXXXXXXXXXXXXXXXXXXXXXXXXX # Discord channel webhook url
   ```

6. Remove `.example` suffix from `/packages/frontend/.env.local.example` files and write with real values.
   ```bash
   NEXT_PUBLIC_TWITCH_CLIENT_ID=XXXXXXXXXXXXXXXXXXXXXXXXXX # Twitch App Client ID
   NEXT_PUBLIC_TWITCH_CALLBACK_URL=http://localhost:8080/callback
   NEXT_PUBLIC_API_SERVER=http://localhost:3000
   ```

> You must need a MongoDB server to store the data. If you dont have any, you can run: `yarn docker:install` and `yarn docker:start`. You will need Docker.

## Branching

To keep `master` branch clean, we are going to use a simple brancing strategy.

1. **Nobody** can to master.
2. All the work needs to be merged to `dev` branch.
3. Features will start with `feature/<branch>`.
4. Fixes will start with `fix/<branch>`.
5. Branches will be in kebab-case.
6. Every merge between `dev` and `branch` will be considered a release.

![Branching](./docs/branching.png)

```bash
# Bad
usersSubsFeature
usersSubsFix
someOtherThing

# Good
feature/users-subs
fix/users-subs
some-other-thing
```

> - **What is a fix?** When you make something works, when was broke.
> - **What is a feature?** When you add something to the code, what brings value to the project.

<!-- CONTACT -->

## Contact

Enrique Bernabeu - [@enriquedev\_](https://twitter.com/enriquedev_) - ebvcontacto@gmail.com

Project Link: [https://github.com/enriquebv/getskills](https://github.com/enriquebv/getskills)
