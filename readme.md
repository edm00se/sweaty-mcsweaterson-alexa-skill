# Sweaty McSweaterson Alexa Skill

An Alexa skill that finally answers the big question...

> will I sweat today?

![melting popsicle](./assets/sweatySkillIcon.png)

[view the skill on Amazon.com](https://amazon.com/edm00se-Sweaty-McSweaterson/dp/B07K16B9VV/)


## Installation

- `npm install`
- ensure the Lambda environment has `SWEATY_OPEN_WEATHER_API_KEY` configured

## Usage

- `npm test`
- `npm run build`
- deploy the generated `.zip` bundle from `build/` to AWS Lambda

## Modernization notes

- uses native Node `fetch` instead of the legacy `got` HTTP client
- keeps the Alexa request flow and skill behavior stable
- targets a modern Node runtime (`>=20`) for the project tooling and Lambda packaging

## Credits

- [ASK SDK](https://npm.im/ask-sdk)
- [Erol Ahmed's `Popsicle Melting under the Heat of Summer`, on unsplash](https://unsplash.com/photos/fhWNnHmW40Y)

## License

MIT
