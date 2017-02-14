export const acFormat = {
  _id: 'someId',
  acVersion: '1',

  properties: {
    originalId: '3',

    lastSourceImportId: 'R7tbPmwn8Jbhi54rM',
    infoPageUrl: 'https://...',
    placeWebsiteUrl: 'https://...',

    license: {
      name: 'GPLv3',
      licenseURL: 'https://accessibility.cloud/licenses/23asxas23k2d2',
    },

    sourceId: 'BwEuneiKbLGJyEeDE',
    sourceDetails: {
      name: 'source name',
      sourceURL: 'https://',
    },

    name: 'Hotel Adlon',                              // short name
    description: '',                                  // optional
    address: '',
    category: 'hotel',                                // see [ac-categories]

    accessibility: {
      accessibleWith: {
        wheelchair: true,
        guideDog: true,
        limitedSight: true,
      },

      offersActivitiesFor: {
        hearingImpaired: true,
        learningImpaired: true,
        physicallyImpaired: true,
        visuallyImpaired: true,
      },

      stairs: [
        {
          count: '>10 ± 2',
          hasHighcontrastAndAntiSlipStairNosing: true,    // needs review
          name: 'mainStaris',
          stepHeight: '12cm ±1',
          hasHandRail: true,
          hasStairLift: true,
          hasTactileSafetyStrip: true,
          wheelChairPlatformLift: {
            height: '120cm',
            width: '110cm',
          },
        },
      ],

      areas: [
        {                                                        // 'hotelRoom?'
          tags: ['indoors', 'outdoors', 'meeting-room', 'confidential', 'bedroom', 'terrace', 'roof', 'front-space'],   // TBD
          name: '',
          floorLevel: 1,

          ratingSpacious: 1,                      // needs review
          isWellLit: true,
          isQuiet: true,

          ground: {
            isStepLess: true,
            distanceToDroppedCurb: '<20m ±10',      // interpretation of 'nearby',
            slopeAngle: '6deg',
            isCobbleStone: true,                    // RFC: replace with 'evenPavement'
            turningSpace: '<150cm',                 // interpretation of 'very narrow'
            streetIsSloping: true,
          },

          pathways: {                               // RFC do we need this group?
            //turningsSpaceInFrontOfRelevantFurniture: '>140',        // find better adj for 'relevant'
            //widthOfOpeningsAndAisles: '> 140cm',
            //widthOfAllOpeningsAndAisles: '>90',             // RFC
            //width: '>150',
            //widthAtObstacles: '>90cm',
            //spaceBetweenExistingBallards: '>90cm',
            width: '>150',
            widthAtObstacles: '>90cm',
            maxLongitudinalSlope: '<6deg',
            maxLateralSlope: '<2.5deg',
          },

          entrances: [
            {
              name: 'Main Entrance',
              ratingForWheelchair: 0.9,
              isMainEntrance: true,
              isStepFree: false,
              isALift: true,
              hasRemovableRamp: false,
              slopeAngle: '6%',                       //
              hasVisualSign: true,                    // needs review
              hasBrailleSign: true,
              needsRadarKey: true,
              needsEuroKey: true,

              intercom: {
                isAvailable: true,
                height: '90..120cm',
                isColorContrastedWithWall: true,      // needs review
              },
              stairs: {
                count: '>10 ± 2',
                hasHighcontrastAndAntiSlipStairNosing: true,    // needs review
                name: 'mainStaris',
                stepHeight: '12cm ±1',
                hasHandRail: true,
                hasStairLift: true,
                hasTactileSafetyStrip: true,
                wheelChairPlatformLift: {
                  height: '120cm',
                  width: '110cm',
                },
              },
              door: {
                isAutomatic: false,
                width: '85cm',
                hasClearMarkingOnGlassDoor: false,
                isEasyToHoldOpen: false,
                hasErgonomicDoorHandle: false,
                isRevolving: false,
              },
            },
          ],
          restrooms: [
            {
              signage: {
                unisex: true,
                male: true,
                female: true,
              },
              ratingForWheelchair: 0.3,
              turningSpaceInside: '>150cm',
              hasBathTub: true,
              mirrorAccessibleWhileSeated: true,
              heightOfMirrorFromGround: '100cm',
              hasSupportRails: true,
              heightOfSoapAndDrier: '100 .. 120cm',
              hasSpaceAlongsideToilet: true,
              washBasinAccessibleWithWheelchair: true,
              shampooAccessibleWithWheelchair: true,
              entrance: {
                isAutomatic: false,
                doorWidth: '85cm',
                hasClearMarkingOnGlassDoor: false,
                isEasyToHoldOpen: false,
                hasErgonomicDoorHandle: false,
                isStepFree: true,
                turningSpaceInFront: '>150cm',
                doorOpensToOutside: true,
                needsRadarKey: true,
                needsEuroKey: true,
              },
              toilet: {
                heightOfBase: '40 .. 45cm',
                spaceOnLeftSide: '>70',
                spaceOnRightSide: '>70',
                foldableHandles: {
                  onLeftSide: true,
                  onRightSide: true,
                  height: '>85cm',
                  extensionOverToilet: '>28cm',     // RFC: better label required,
                  distance: '60 .. 65cm',
                },
              },
              hasShower: true,
              shower: {
                hasSupportRails: true,
                step: '<2cm',
                isWalkIn: true,                        // needs review
                supportRails: {
                  height: '85 .. 107cm',
                  aboveAndBelowControls: true,
                },
                controls: {
                  height: '85cm',
                  isEasyToUse: true,
                  hasErgonomicHandle: true,
                },
                hasShowerSeat: true,
                showerSeat: {
                  isRemovable: true,
                  isFixed: false,
                  isFoldable: false,
                },
              },
              washBasin: {
                accessibleWithWheelchair: true,
                height: '>80cm',
                spaceBelow: {
                  height: '> 67cm',
                  depth: '30cm',
                },
              },
            },
          ],

          powerOutlets: {
            haveContrastColor: true,
            isErgnomicToUse: true,
            hasChildProtection: true,
            height: '10 .. 30cm',
          },
          switches: {                           // RFC: rename to "controls?"
            haveContrastColor: true,
            isErgnomicToUse: true,
            height: '120cm',
          },

          bed: {
            height: '120cm ± 10',
            adjustableHeight: '30 .. 140cm',
            turningSpaceBeside: '>90cm',
            spaceBelow: '20cm',
          },

          wardrobe: {
            heightForRail: '<140cm',
            turningSpaceInFront: '>140cm',
          },

          changingRoom: {
            turningSpaceInside: '>150cm',
            hasSupportRails: true,
            heightOfMirrorFromGround: '100cm',
            heightOfHooks: '<120cm',
            seatingIsPossible: true,
          },

          stage: {
            isAccessibleWithWheelchair: true,
            durationOfLift: '<10sec',                 // RFC this is very special
            turningSpace: '150cm',
          },

          vendingMachines: [
            {
              name: 'Ticket Machine 1',
              easyToUse: true,
              languages: ['en', 'de'],
              hasHeadPhoneJack: true,
              hasSpeech: true,
              controls: {
                height: '<120cm',
                areHighContrast: true,
                inBraille: true,
                areRaised: true,
              },
            },
          ],

          cashRegister: {
            height: '90cm',
            hasRemovableCreditCardReader: true,
          },

          wheelchairPlaces: {
            count: 1,
            hasSpaceForAssistent: true,
          },

          tables: {
            height: '60 .. 80cm',
            spaceBelow: {
              height: '>67cm',
              depth: '>30cm',
            },
          },

          seats: {
            height: '20 .. 120cm',
          },

          services: {                                     // RFC? do we need to group these
            hasRemovableFurniture: false,
            hasInductionLoop: true,
            hasRemoteControlAudioSigns: true,

            hasTableService: true,
            transferToRegularSeatPossible: true,

            hasMobileSafetyDepositBox: true,
            hasHoist: true,
            hasChangingTable: true,                       //
            hasFlashingOrVibratingFireAlarm: true,

            hasPoolAccessFacility: true,
            hasSaunaWheelchair: true,
            hasManualWheelChair: true,
            hasAllTerrainWheelChair: true,
            hasVehiclesAreAdaptedForWheelchairs: true,
          },

          sitemap: {
            distanceFromEntrance: '<10m',
            isBraille: true,
            isRaised: true,
            hasLargePrint: true,
            languages: ['en'],
            hasSimpleLanguage: true,
          },

          tactileGuideStrips: {
            isGuidingToInfoDesk: true,                              // needs review
            hasVisualContrat: true,
          },

          infoDesk: {
            heightOfCounter: '<=80cm',
            distanceToEntrance: '<10m',
          },

          signage: {
            isReadible: true,
            languages: ['de'],
          },

          media: [
            {
              type: 'documents',                          // documents|menu|audioGuide|presentations|exhibits|movie|screen,
              name: 'Speisekarte',
              isBraille: true,
              isAudio: true,
              isLargePrint: true,
              hasContrastingBackground: true,
              isEasyToUnderstand: true,
              hasDedicatedScreenForSubtitles: true,
              hasSubtitles: true,
              hasRealtimeCaptioning: true,
              languages: ['en', 'de'],
              turningSpaceInFront: '>140cm',
              isClearlyVisibleWhileSeated: true,
              isInformationReadableWhileSeated: true,
            },
          ],
        },
      ],
      staff: {
        canSeeVisitorsFromInside: true,
        canAssistWithSpecialNeeds: true,
        isTrainedInSigning: true,
        hasFreeAssistentForVisitors: true,
        isTrainedInAccomodattingVisitorsWithDisabilities: true,   // very unspecific and loooong
      },
      lifts: [
        {
          name: 'Main Lift',
          hasVoiceAnnounceSystem: true,
          hasEmergencyVoiceIntercom: true,
          controls: {
            height: '90 .. 120cm',
            isHighContrast: true,
            isBraille: true,
            isRaised: true,
          },
          cabin: {
            width: '140cm',
            length: '110cm',
            door: {
              width: '100cm',
            },
          },
        },
      ],
      parking: {
        parkingSpacesForWheelchairUsers: {
          areAvailable: true,
          location: '2nd floor',
          count: 2,
          isLocatedInside: true,              // needs review
          width: '>350cm',
          length: '>500cm',
          hasDedicatedSignage: true,
        },
      },
    },
  },
  geometry: {
    type: 'Point',
    coordinates: [
      -123.13700000000000045,
      49.251339999999999009,
    ],
  },
};
