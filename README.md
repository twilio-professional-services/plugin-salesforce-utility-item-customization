# Salesforce Utility Item Customization Plugin for Flex

## Things it does

* Resizes the Flex softphone dynamically in Salesforce via Open CTI - to reduce the Flex footprint when handling calls
* Focuses the softphone whenever the utility item renders (so when launching Salesforce, or refreshing page)
* Also "pops" the softphone into view whenever a new call reservation comes in
* Displays CRM panel whenever agent wraps a task. CRM panel is customized with a mock agent-level dashboard - for visuals 
  * Thinking here is that one day we might have the agent stats pulling from data available within Flex real time stats model 
* Hides the CRM panel on the right whenever a task is accepted
* Manipulates Utility Bar tab text and icon as call lifecycle progresses “Incoming Call”, “Active Call”, “Completed Call”, “No Calls”
* Disables the popout feature of the Utility Bar item - to prevent active calls from being dropped whenever this happens and the page reloads
* Offers a "Refresh Salesforce" button in the header when handling a call, to reload the current view in Salesforce (without needing to perform a dangerous page refresh)



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


