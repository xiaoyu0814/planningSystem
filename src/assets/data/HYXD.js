var polygon = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "id": 1,
        "TEMPmean": 9.581370792659968,
        "WINDmean": 2.067272405045974
      },
      "geometry": {
        "type": "MultiPolygon",
        "coordinates": [
          [
            [
              [
                45.3019,
                2.016
              ],
              [
                45.3037,
                2.0133
              ],
              [
                45.3173,
                2.0216
              ],
              [
                45.3151,
                2.0257
              ],
              [
                45.3019,
                2.016
              ]
            ]
          ]
        ]
      }
    }
  ]
}

var line = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "LineString",
        "coordinates": [
          [
            45.3275728225708,
            2.054121205737115
          ],
          [
            45.32613515853881,
            2.0572412877739596
          ],
          [
            45.309247970581055,
            2.0514299960608118
          ],
          [
            45.31062126159668,
            2.0316585801602134
          ],
          [
            45.30203819274902,
            2.0178484669954915
          ],
          [
            45.30169486999512,
            2.01677624832392
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "LineString",
        "coordinates": [
          [
            45.3275728225708,
            2.054122545979857
          ],
          [
            45.32613515853881,
            2.05724195789402
          ],
          [
            45.33453047275543,
            2.0601737304478
          ],
          [
            45.33355951309204,
            2.0673413052478637
          ]
        ]
      }
    }
  ]
}

export { polygon, line }