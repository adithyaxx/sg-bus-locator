# SG-Bus-Locator
<a target="_blank" href=""><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg"></a>

_A RESTful API that provides coordinates and bearing of public buses in Singapore_

Coordinates of approaching buses in relation to bus stops along a route are collected and their bearings are calculated using the coordinates of the bus stops before and after the current position of those buses.

## Usage

### Request

https://sg-bus-locator.appspot.com/ `?busNo=179`

Parameter | Value
--------- | -----
`busNo` | `179` `179A` `199`

### Response
```
{
  "locations": [
    {
      "lat": "1.3525963333333333",
      "lng": "103.701145",
      "bearing": 322
    },
    {
      "lat": "1.3547865",
      "lng": "103.6980745",
      "bearing": 255
    },
    {
      "lat": "1.3508146666666667",
      "lng": "103.67834783333333",
      "bearing": 222
    }
  ]
}
```

## Limitations
The API only provides information for 179, 179A and 199 as of now

## Contributors
- [Wei Cong](https://github.com/weicong96)

## Credits
* Based on [this project](https://github.com/cheeaun/arrivelah)
* Positioning data is fetched from [LTA DataMall APIs](https://www.mytransport.sg/content/mytransport/home/dataMall.html)
