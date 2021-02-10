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

<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary><h2 style="display: inline-block">Table of Contents</h2></summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgements">Acknowledgements</a></li>
  </ol>
</details>

## About The Project
This project makes it easy to create experiences for your viewers using channel points. It will be used to change your scenes (Streamlabs OBS, OBS), to show animations and sounds, to create bidding systems, or even to connect to your led lights or other devices.

### Built With

* [NestJS](https://nestjs.com/)
* [Next.js](https://nextjs.com/)
* [TypeScript](https://www.typescriptlang.org/)
* [MongoDB](https://www.mongodb.com/)


## Getting Started

To get a local copy up and running follow these simple steps.

### Prerequisites

* [Node.js](https://nodejs.org/)
* [MongoDB](https://www.mongodb.com/)
* [Yarn 1.x](https://classic.yarnpkg.com)

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
5. Remove `.example` suffix from `.env` files and write with real values.
    ```bash
    NEXT_PUBLIC_TWITCH_CLIENT_ID=<your-twitch-client-id>
    # TODO fill with real .env data
    ```

<!-- ROADMAP -->
## Roadmap

- [ ] Bids
- [ ] Broadcast tools integrations
    - [ ] Streamlabs OBS
    - [ ] OBS Studio
- [ ] Zapier

[Open an issues](https://github.com/enriquebv/getskills/issues) to propose features (and know issues).


<!-- CONTRIBUTING -->
## Contributing

You can contribute in two ways:

### Patreon
To help to mantain the main site ([GetSkills.live](https://getskills.live)) you can support in **[Patreon](https://patreon.com/enriquedev)**. 

### Code
Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature OR Fix Branch:
    - Feature: `git checkout -b feature/AmazingFeature`)
    - Fix: `git checkout -b fix/AmazingFix`
3. Commit your Changes (`git commit -m 'Add some AmazingThing'`)
4. Push to the Branch (`git push origin feature/AmazingThing`)
5. Open a Pull Request

<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE` for more information.

<!-- CONTACT -->
## Contact

Enrique Bernabeu - [@enriquedev_](https://twitter.com/enriquedev_) - ebvcontacto@gmail.com

Project Link: [https://github.com/enriquebv/getskills](https://github.com/enriquebv/getskills)
