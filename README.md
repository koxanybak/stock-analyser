# Scrooge's Stock Analyser


### Get started

Make sure you have a recent version of Node and NPM installed.

Install the dependencies if you haven't already

```sh
$ npm install
```

Start in production

```sh
$ npm run start-ts
or
$ npm run build && npm start
```

Start in development

```sh
$ npm run dev
```

### Docs
**In short:**
Send valid CSV data to /api/upload and query info about it from /api/upload?start=mm/dd/yy&end=mm/dd/yy

| Endpoint | Type | Body | Query params |
| ------ | ------ | ------ | ------ |
| /api/upload | POST | CSV file as form-data, **key**: csv | - |
| /api/info | GET | - | **start**: mm/dd/yy; **end**: mm/dd/yy |

**CSV format:**
```
Date, Close/Last, Volume, Open, High, Low
01/26/2021, $143.16, 98390560, $143.6, $144.3, $141.37
01/25/2021, $142.92, 157611700, $143.07, $145.09, $136.54
...
```
The upload endpoint doesn't currently support empty or otherwise malformatted fields. It responds with a 400 error if
such data is sent.
Responds with 204 if successful.

**An example response:**
/api/info
```
{
    "longestBullTrend": 10, // The most amount of days in a row the stock price has been rising. (At least one)
    "volumeAndPriceChange": [ // A list of volumes, and the largest price change within a day.
    // Ordered first by volume and by price change second.
    
    // NOTE: Don't know why Scrooge wanted a single list sorted like this if he wanted to find out
    // both the highest volume and the most significant stock price change within a day. From this list
    // it's not really easy to find out the latter. If I was consulting Scrooge, I probably would've told him
    // that this is not optimal.
        {
            "date": "02/28/20",
            "volume": 426884800,
            "priceChange": 5.510000000000005 // Currency is the same as in the csv
        },
        {
            "date": "03/12/20",
            "volume": 418474000,
            "priceChange": 5.5
        },
        ...
    ],
    "openToSMA5": [ // A date's open price compared to it's SMA5
    
    // If there are less than 5 dates before a date in the range(start, end),
    // the SMA5 is calculated from less than 5 dates.
    // The 'priceChangePercentage' is 0 for a date if there are no dates before it.
        {
            "date": "08/03/20",
            "priceChangePercentage": 11.419465454302058
        },
        {
            "date": "08/24/20",
            "priceChangePercentage": 9.339489994010396
        },
        ...
    ]
}
```
