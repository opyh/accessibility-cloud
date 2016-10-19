# AC interachange format

## Considerations:

- Needs to be easily convertible into existing data-formats for services like AXSMaps, Jaccede, and Wheelmap.
- Should enable import of very detailed data for different needs and focus areas
- Should be structured
- Should be extendible but backwards compatible
- Should be human readable and as compact as neccessary.
- The general structure of [jaccedeMapAPI](http://apidoc.jaccede.com/) is a good starting point.
- There should be a current valid schema for the complete accessiblity-specification. Thise schema is validated during import and mappings with invalid datapoints or formats produce warnings and are omitted. However, additions, refinements and clarifications of that schema should be moderated by the ac-community painless and fast. (e.g. 1-3 days between suggestion and implementation).
- Sooner or later a visual mapping / exploration / description of the data catalog is necessary. [This concept](https://invis.io/XF8W2XHE4#/130859674_A06-Details) can be a good starting point.
- We group different aspects of the accessibility-data spacially (entrance, stairs, restrooms) instead of need (wheelchair vs. visually impaired).
- Should balance depth of datastructure with amount of properties.  E.i. don't nest two properties for the sake of nesting.
- Group interpreting/sumarization properties outside of groups (e.g. don't nest `.isStepFree`  into `.steps.`. Otherwise the path of the complete property would be awkward to read (`.entrance.isStepFree` is better than `.entrance.steps.isStepFree`)

## Code-style

- Geoinformation should be geoJSON format.
- For disccusion we can use use a point-notation e.g. `data.accessibility.withWheelchair`

## Preliminary (Under discussion)

- We avoid overall accessibility-ratings like "50% accessible".
- We summarize the accessiblity for different needs with "fully|partial|none" as originally introduced by _Jaccede_. This interpartion/summary has to provided through mapping during the data import.

## Needs discussion / open questions

- "steps" vs. "stairs"
- "available" vs. "exists" vs. "has"
- do we ignore multipe entries, rooms, facilities?
- how do we deal with "jaccede::services/equipment/Other/pleaseSpecify" ?
- "Lavatories" vs. "restroom"
- "restroom" vs. "restrooms"
- room description could be identically for hotel-rooms, dining-rooms, meeting, rooms, etc.
- "hotelroom" vs "hotelRooms"

## A sample response block looks like this:

```
{
    "_id": "ttikRCM5Sz2v2m3cZ",
    "sourceId": "BwEuneiKbLGJyEeDE",
    "acVersion": "1",
    "lastSourceImportId": "R7tbPmwn8Jbhi54rM",

    "properties": {
        "name": "Hotel Adlon",                              // short name
        "description": "",                                  // optional
        "address": "",
        "providedId": "234234",                             // id within data-source
        "category": "hotel",                                // see [ac-categories]

        "accessibility": {
            isAccessibleWithWheelchair: true|false,         // Overall accessibility
            isAccessibleWithGuideDog: true|false,
            isAccessibleWithLimitedSight: true|false,
            ratingForWheelchair: 0.7,
            entrance: {
                isMainEntrance: true,
                intercom: {
                    isAvailable: true,
                    height: "90..120cm",
                    isColorContrastedWithWall: true,
                },
                visitorsAreVisibleFromInside: true,
                ratingForWheelchair: 0 .. 1,
                isStepFree: false,
                steps: {
                    count: ">10 ± 2",
                    stepHeight: "12cm ±1",
                    handRailExists: true,
                    stairLiftExists: true,
                    haveStairNosing: true,
                }
                hasRemovableRamp: false,
                door: {
                    isAutomatic: false,
                    width: "85cm",
                    hasClearMarkingOnGlassDoor: false,
                    isEasyToHoldOpen: false,
                    hasErgonomicDoorHandle: false,
                },
                hasSlope: true,
                hasReadableSign: true,
            },
            restroom: {

            },
            hotelRoom: {
                hasFlashingOrVibratingFireAlarm: true,
                furnitureIsRemovable: false,
                powerOutlets: {
                    haveContrastColor: true
                }
                switches: {
                    haveContrastColor: true,
                }
                bed: {
                    height: "120cm ± 10",
                    heightIsAdjustable: false,
                    turningSpaceBeside: ">90cm",
                    spaceBelow: "20cm",
                },
                entrance: {
                    isAutomatic: false,
                    doorWidth: "85cm",
                    hasClearMarkingOnGlassDoor: false,
                    isEasyToHoldOpen: false,
                    hasErgonomicDoorHandle: false,
                    isStepFree: true,
                    turningSpaceInFront: ">150",
                    roomNumberIsRaisedOrBraille: true,
                },
                wardrope: {
                    heightForRail: "<140cm",
                    turningSpaceInFront: "",
                }
                restroom: {
                    entrance: {
                        isAutomatic: false,
                        doorWidth: "85cm",
                        hasClearMarkingOnGlassDoor: false,
                        isEasyToHoldOpen: false,
                        hasErgonomicDoorHandle: false,
                        isStepFree: true,
                        turningSpaceInFront: ">150cm",
                    },
                    turningSpaceInside: ">150cm",
                    hasBathTub: true,
                    hasSupportRails: true,
                    heightOfMirrorFromGround: "100cm",
                    heightOfToiletBase: "40 .. 45cm",
                    heightOfSoapAndDrier: "",
                    hasShower: true,
                    shower: {
                        hasSupportRails: true,
                        isWalkIn: true,
                        hasShowerSeat: true,
                        showerSeat: {
                            isRemovable: true,
                            isFixes: false,
                            isFoldable: false
                        }
                    }
                    hasSpaceAlongsideToilets: true,
                    washBasingAccessibleWithWheelchairs: true,
                },
            },

            inside: {
                spacious: 0.6,
                welllit: 0.5,
            },
            parking: {
                disabledParkingSpaces: {
                    areAvailable: true,
                    widerThanRegularSpaces:,
                    count: "2",
                    locatedInside: true,
                }
            },
            outside: {
                pavement: {
                    distantToDroppedKerbs: "<20m ±10",  // interpretation of "nearby",
                    hasSignificantSlope: false,
                    isCobbleStone: true,
                    streetIsSloping: true,
                    turningSpace: "<150cm",             // interpretation of "very narrow"
                }
            },
        },
    }
    "geometry": {
        "type": "Point",
        "coordinates": [
            -123.13700000000000045,
            49.251339999999999009
        ]
    }
}
```



## Properties 
- We should invest some time to think about dealing with property-types early, because making things "up on the fly" will likely either make things inprecise, or difficult to read either for machines or humans.
- API responses should be concise:
    - if possible optimized for a target audience (e.g. wheelchair users) and locale (e.g. United States)
    - only include existing data (no "undefined" properties)
    - should avoid interpretation (the recommendations for required door width might vary between different countries)
    - if possible avoid attributes that require clarification (e.g. restroom is 45% accessible)
    - should be convertible/styleable into beautiful output with a library (see chapter "interpreting and styling data")
    - be made for human consumption (isAccessible: 20% does not help me)
- Property names should ...
    - be as concise as possible
    - be american english
    - should avoid accronyms
    - be camelCase
    - not repeat parent-attributes (e.g. bad: `"doorOpening.doorWidth": ...`  better: `"entrance.width" : "90cm ±5"`)
    - not include units (e.g. bad: `"doorOpening.widthInCm" : ...`   better: `".entrance.width": ">90cm"`)
    - not include ranges (e.g. bad: `"steps.moreThan3: ..."`  better: `".steps.count": ">3"` )
    - focus on good accessibility rather than negative obstacles:  e.g. `.easyToHoldOpen` or `hasErgnomicHandle` are better than `.difficultToOpen`, `doorHandleNotPractical`, or `isNotMainEntrance`
    - indicate if property is a boolean, e.g. `hasHandrail`, `clearlyVisible`, `removableRampAvailable`
    - not be confused with translation (e.g. If we call a propertie 'Restroom' or 'Bathroom' can be solved by translations)
    - indicate interpreting summaries with a `rating*`-prefix, e.g. `entrance.ratingForWheelchair`
    - be as self-contained as possible `furnitureIsRemovable` is better than `room.hasRemovableFurniture`
- Precission may vary for various reasons:
    - edges might be curved or slanted
    - precise measuring might not be possible.
    - multipe entities with a range of values might exist (e.g. several doors or windows)
    - it's better to have an inmprecise estimation that no attribute at all.
    - We are aware of the intrisinc complexity. But we can add this feature later.
- We suggest to store all values in meters and convert on the fly into human readible format either by a library or by the API:
    - API request could specify the locale to prefare inches over centinemters.
    - defaults for these settings could already be entered with the access-key-settings
- Different units should be supported: widths and height might be specified and cm, however, distances (like to the next parking spot) are given in m or even kilometer.
- Properties should also store relavancy for different needs.
- Also definitions of valid/required valid-ranges together with references would be of enormous value.

## Example definition of a property

As of Oct 2016 this is under heavy development and not even close to production.

    'accessibility.access.entrance.door.width': {
        '_id': 'accessibility.access.entrance.door.width',
        'parentId':'accessibility.access.entrance.door',
        'name': 'width',
        'path': 'accessibility.access.entrance.door.width',
        'type': 'distance',
        'translations': {
            'en': "Door-width",
            'de': "Türbreite",
        },
        'imageURL': "",
        'iconURL': "",
        'relevancy': {
            'wheelchairs': 1,
            'blind':0,
        },
        'description': "markdown wiki-description with links guidelines and discussions",
        'preferedUnit': 'cm',
        'contraints: {
            'validRange': "0.3 .. 10",
        },
        'requirements': [
            {
                relevantFor: ['wheelchairs', 'electic wheelchairs'],
                ranges: {
                    '0 .. 0.8':'inaccessible',
                    '0.9 .. 0.8':'limited',
                    '0.9 .. inifinity':'accessible',
                },
                references: [
                    'url':"http://www.reisen-fuer-alle.de/qualitaetskriterien_fuer_rollstuhlfahrer_324.html",
                    'name': "Reisen für alle",
                    'country': 'de'
                ]
            }
        ]
    }

## Reoccuring property-groups

- Reoccuring elements should be consistent: the description format of entrances should be identical for `entrance`, `room.entrance.`, `room.restroom.entrance`
- Attributes (like the "width of a door") and relevant value ranges (less or more than 90cm) should be separated. The interpretation/format of the value should not be mixed with the storage of the value in the database.
- The exported format should be optimized for human readibility 

        entrance: {
            isAutomatic: false,
            doorWidth: "85cm ±2",
            hasClearMarkingOnGlassDoor: false,
            isEasyToHoldOpen: false,
            hasErgonomicDoorHandle: false,
            isStepFree: true,
            turningSpaceInFront: ">150cm",
        },

### Boolean properties
- The world is not black and white. However the data of AC should be optimized for the consumption by non-expert, which prefare "we believe this place is accessible for wheelchair users" over "93% of reviewers gave an accessiblity-rating for 50% or higher". If necessary, we should not sacrifice the usefulness for the majority of the users over the requirements and opinions of few domain-experts. Never the less, we should always try provide additional data on how a boolean yes/no claim has been made.
- To avoid legal claims AC should clearily reject all responsibility for the quality of the given data.
- For a specific place we should only store boolean-attributes if a clear 'yes|no' was possible. For undecided properties we should leave the db-reference blank.

#### Numeric properties ("Qualifiers")
- Examples:
    - `entrance.doorOpening.width`
    - `entrance.doorOpening.heightOfDoorHandle`
    - `entrance.doorOpening.heightOfSingleStep`

### Strings properties
- Examples
    - Addresse etc.

### Times / Opening-Hours


## Interpreting and styling data
- AC should provide a library that allows the interpretation of response data.
- For all properties we should have offer a locale interpretation schema that includes...
    - translation
    - descriptions
    - valid/recommented/required ranges, e.g.
        ".doorOpening.width" : { "<0.9":   }
    - relevancy for different forms of disability
    - human readible units (e.g. cm/inch, vs. m/ft vs. km/miles)
    - backlink to AC-wiki for that property with further discussion, norms, laws, regulations for different countries.
- The lib should of functionality for converting metric data into human readible local "0.900001±1" -> "90cm".

## Storing properties with precision in the database
- Use-cases to think about:
    - less-then
    - more than
    - exactly
    - between x .. y
    - ± a certain amount
- This qualifiers should be combineable:
    - e.g. `"building.access.entrance.door.width": "80..90cm ± 5"`
    - e.g. `"building.access.entrance.stepCount": ">25 ± 3"`
- This topics needs further research: We need to balance:
    - performance impact of converting units on API-responses (this could impact caching)
    - possibility to perform precise db-queries (e.g. "all hotels in Berlin with a step between 5 and 10cm")


#### Additional references

Wiki-Data has a very elaborate system of defining the valid ranges of properties.
- [WikiData All Properties](https://www.wikidata.org/wiki/Wikidata:Database_reports/Constraint_violations/All_properties)
- [WikiData Constraints](https://www.wikidata.org/wiki/Template:Constraint)


### Fringe-Cases that eventually need specification

- non-point geo-information (e.g. bus-lines, parks, path-ways)
- image-annotations
- 3d-models / scans
- surface-properties (curbs on street-corners)

### Additional questions

- How do we handle changes in the AC-property-structure. It would be conventient to store the schema definition through Id <-> parentId-relationships. Ideally, theses IDs should be human readible, short, immunatable, and respresent the property's path. Obviously these criteria are contradictory.
- These IDs are 


## References to different accessibliity-cataloges

- [Qualitätskriterien für Rollstuhlfahrer](http://www.reisen-fuer-alle.de/qualitaetskriterien_fuer_rollstuhlfahrer_324.html)