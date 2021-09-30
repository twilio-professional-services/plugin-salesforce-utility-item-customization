# Salesforce Utility Item Customization Plugin for Flex

## Things it does

* Resizes the Flex softphone dynamically in Salesforce via Open CTI
  * Expanding it when tasks are all wrapped up, and showing the panel on the right. Thinking here is that one day we might have the agent stats here - pulling from Insights
  * Contracting it when a new call comes in, and hiding the pretend dashboard on the right
  * Manipulates Utility Bar tab text as call lifecycle progresses “Incoming Call”, “Active Call”, “Completed Call”, “No Calls”
    * Further work being done to manipulate icon too

## Things it doesn’t do

* Disable the popout feature of the Utility Bar item
  * We tried everything here, but it seems we don’t get API access to these controls unless it’s a custom component (which Open CTI Softphone is not)


## Demo

<img width="768px" src="screenshots/walkthrough.gif"/>


## About Twilio Flex Plugins

Twilio Flex Plugins allow you to customize the appearance and behavior of [Twilio Flex](https://www.twilio.com/flex). If you want to learn more about the capabilities and how to use the API, check out our [Flex documentation](https://www.twilio.com/docs/flex).

## Setup

Make sure you have [Node.js](https://nodejs.org) as well as [`npm`](https://npmjs.com). We support Node >= 10.12 (and recommend the _even_ versions of Node). Afterwards, install the dependencies by running `npm install`:

```bash
cd 

# If you use npm
npm install
```

Next, please install the [Twilio CLI](https://www.twilio.com/docs/twilio-cli/quickstart) by running:

```bash
brew tap twilio/brew && brew install twilio
```

Finally, install the [Flex Plugin extension](https://github.com/twilio-labs/plugin-flex) for the Twilio CLI:

```bash
twilio plugins:install @twilio-labs/plugin-flex
```

## Development

Best to just deploy this - as you can't easily test in Saleforce with a locally running plugin

## Deploy

When you are ready to deploy your plugin, in your terminal run:
```
Run: 
twilio flex:plugins:deploy --major --changelog "Notes for this version" --description "Functionality of the plugin"
```
For more details on deploying your plugin, refer to the [deploying your plugin guide](https://www.twilio.com/docs/flex/plugins#deploying-your-plugin).


