var trendsJSON = {
  "results": [
    {
      "president": {
        "cols": [
          "id",
          "name",
          "popularVote",
          "popularPercent",
          "electoralVote",
          "electoralPercent"
        ],
        "rows": [
          [
            "Una",
            "Jill Reed",
            24064,
            1,
            0,
            0
          ],
          [
            "AmC",
            "Virgil Goode",
            2066769,
            2,
            0,
            0
          ],
          [
            "Obj",
            "Tom Stevens",
            116088,
            1,
            0,
            0
          ],
          [
            "Cnl",
            "Dean Morstad",
            49876,
            1,
            0,
            0
          ],
          [
            "DCG",
            "Jill Stein",
            3972290,
            4,
            0,
            0
          ],
          [
            "RP",
            "Barbara Washer",
            89751,
            1,
            0,
            0
          ],
          [
            "SWP",
            "James Harris",
            611099,
            1,
            0,
            0
          ],
          [
            "RP",
            "Andre Barnett",
            75380,
            1,
            0,
            0
          ],
          [
            "CST",
            "Will Christensen",
            14431,
            1,
            0,
            0
          ],
          [
            "Dem",
            "Barack Obama",
            39482895,
            42,
            272,
            51
          ],
          [
            "Una",
            "Richard Duncan",
            79873,
            1,
            0,
            0
          ],
          [
            "IP",
            "Rocky Anderson",
            1049593,
            1,
            0,
            0
          ],
          [
            "ATP",
            "Merlin Miller",
            65806,
            1,
            0,
            0
          ],
          [
            "GRP",
            "Jim Carlson",
            36730,
            1,
            0,
            0
          ],
          [
            "SPU",
            "Stewart Alexander",
            115558,
            1,
            0,
            0
          ],
          [
            "Ind",
            "Jeff Boss",
            37382,
            1,
            0,
            0
          ],
          [
            "Ind",
            "Jerry Litzel",
            31669,
            1,
            0,
            0
          ],
          [
            "NPD",
            " None of these candidates",
            48246,
            1,
            0,
            0
          ],
          [
            "AIP",
            "Tom Hoefling",
            140067,
            1,
            0,
            0
          ],
          [
            "WTP",
            "Sheila Tittle",
            93825,
            1,
            0,
            0
          ],
          [
            "PSL",
            "Peta Lindsay",
            493916,
            1,
            0,
            0
          ],
          [
            "GOP",
            "Mitt Romney",
            38234232,
            41,
            266,
            49
          ],
          [
            "Pro",
            "Jack Fellure",
            72853,
            1,
            0,
            0
          ],
          [
            "PFP",
            "Roseanne Barr",
            225731,
            1,
            0,
            0
          ],
          [
            "Ind",
            "Gary Johnson",
            6557064,
            7,
            0,
            0
          ],
          [
            "SEP",
            "Jerry White",
            162970,
            1,
            0,
            0
          ],
          [
            "RP",
            "Chuck Baldwin",
            43566,
            1,
            0,
            0
          ],
          [
            "Ind",
            "Randall Terry",
            178640,
            1,
            0,
            0
          ],
          [
            "PSL",
            "Gloria La Riva",
            234118,
            1,
            0,
            0
          ]
        ],
        "name": "President of the United States",
        "percentReporting": 100
      }
    },
    {
      "senate": {
        "cols": [
          "id",
          "seats",
          "percent",
          "delta"
        ],
        "rows": [
          [
            "Dem",
            52,
            52,
            1
          ],
          [
            "GOP",
            46,
            46,
            -1
          ]
        ],
        "name": "Control of Senate",
        "total": 100,
        "balance": 50,
        "undecided": 2
      }
    },
    {
      "house": {
        "cols": [
          "id",
          "seats",
          "percent",
          "delta"
        ],
        "rows": [
          [
            "Dem",
            181,
            42,
            -9
          ],
          [
            "GOP",
            235,
            54,
            -5
          ]
        ],
        "name": "Control of House",
        "total": 435,
        "balance": 218,
        "undecided": 19
      }
    },
    {
      "governors": {
        "cols": [
          "id",
          "seats",
          "percent",
          "delta"
        ],
        "rows": [
          [
            "Dem",
            18,
            36,
            -2
          ],
          [
            "GOP",
            29,
            58,
            0
          ],
          [
            "Ind",
            1,
            2,
            0
          ]
        ],
        "name": "Governors",
        "total": 50,
        "balance": 0,
        "undecided": 2
      }
    }
  ]
};

var trendsProcessed = {
  "president": {
    "name": "President of the United States",
    "percentReporting": 100,
    "parties": [
      {
        "id": "Una",
        "name": "Jill Reed",
        "popularVote": 24064,
        "popularPercent": 1,
        "electoralVote": 0,
        "electoralPercent": 0,
        "index": 0
      },
      {
        "id": "AmC",
        "name": "Virgil Goode",
        "popularVote": 2066769,
        "popularPercent": 2,
        "electoralVote": 0,
        "electoralPercent": 0,
        "index": 1
      },
      {
        "id": "Obj",
        "name": "Tom Stevens",
        "popularVote": 116088,
        "popularPercent": 1,
        "electoralVote": 0,
        "electoralPercent": 0,
        "index": 2
      },
      {
        "id": "Cnl",
        "name": "Dean Morstad",
        "popularVote": 49876,
        "popularPercent": 1,
        "electoralVote": 0,
        "electoralPercent": 0,
        "index": 3
      },
      {
        "id": "DCG",
        "name": "Jill Stein",
        "popularVote": 3972290,
        "popularPercent": 4,
        "electoralVote": 0,
        "electoralPercent": 0,
        "index": 4
      },
      {
        "id": "RP",
        "name": "Barbara Washer",
        "popularVote": 89751,
        "popularPercent": 1,
        "electoralVote": 0,
        "electoralPercent": 0,
        "index": 5
      },
      {
        "id": "SWP",
        "name": "James Harris",
        "popularVote": 611099,
        "popularPercent": 1,
        "electoralVote": 0,
        "electoralPercent": 0,
        "index": 6
      },
      {
        "id": "RP",
        "name": "Andre Barnett",
        "popularVote": 75380,
        "popularPercent": 1,
        "electoralVote": 0,
        "electoralPercent": 0,
        "index": 7
      },
      {
        "id": "CST",
        "name": "Will Christensen",
        "popularVote": 14431,
        "popularPercent": 1,
        "electoralVote": 0,
        "electoralPercent": 0,
        "index": 8
      },
      {
        "id": "Dem",
        "name": "Barack Obama",
        "popularVote": 39482895,
        "popularPercent": 42,
        "electoralVote": 272,
        "electoralPercent": 51,
        "index": 9
      },
      {
        "id": "Una",
        "name": "Richard Duncan",
        "popularVote": 79873,
        "popularPercent": 1,
        "electoralVote": 0,
        "electoralPercent": 0,
        "index": 10
      },
      {
        "id": "IP",
        "name": "Rocky Anderson",
        "popularVote": 1049593,
        "popularPercent": 1,
        "electoralVote": 0,
        "electoralPercent": 0,
        "index": 11
      },
      {
        "id": "ATP",
        "name": "Merlin Miller",
        "popularVote": 65806,
        "popularPercent": 1,
        "electoralVote": 0,
        "electoralPercent": 0,
        "index": 12
      },
      {
        "id": "GRP",
        "name": "Jim Carlson",
        "popularVote": 36730,
        "popularPercent": 1,
        "electoralVote": 0,
        "electoralPercent": 0,
        "index": 13
      },
      {
        "id": "SPU",
        "name": "Stewart Alexander",
        "popularVote": 115558,
        "popularPercent": 1,
        "electoralVote": 0,
        "electoralPercent": 0,
        "index": 14
      },
      {
        "id": "Ind",
        "name": "Jeff Boss",
        "popularVote": 37382,
        "popularPercent": 1,
        "electoralVote": 0,
        "electoralPercent": 0,
        "index": 15
      },
      {
        "id": "Ind",
        "name": "Jerry Litzel",
        "popularVote": 31669,
        "popularPercent": 1,
        "electoralVote": 0,
        "electoralPercent": 0,
        "index": 16
      },
      {
        "id": "NPD",
        "name": " None of these candidates",
        "popularVote": 48246,
        "popularPercent": 1,
        "electoralVote": 0,
        "electoralPercent": 0,
        "index": 17
      },
      {
        "id": "AIP",
        "name": "Tom Hoefling",
        "popularVote": 140067,
        "popularPercent": 1,
        "electoralVote": 0,
        "electoralPercent": 0,
        "index": 18
      },
      {
        "id": "WTP",
        "name": "Sheila Tittle",
        "popularVote": 93825,
        "popularPercent": 1,
        "electoralVote": 0,
        "electoralPercent": 0,
        "index": 19
      },
      {
        "id": "PSL",
        "name": "Peta Lindsay",
        "popularVote": 493916,
        "popularPercent": 1,
        "electoralVote": 0,
        "electoralPercent": 0,
        "index": 20
      },
      {
        "id": "GOP",
        "name": "Mitt Romney",
        "popularVote": 38234232,
        "popularPercent": 41,
        "electoralVote": 266,
        "electoralPercent": 49,
        "index": 21
      },
      {
        "id": "Pro",
        "name": "Jack Fellure",
        "popularVote": 72853,
        "popularPercent": 1,
        "electoralVote": 0,
        "electoralPercent": 0,
        "index": 22
      },
      {
        "id": "PFP",
        "name": "Roseanne Barr",
        "popularVote": 225731,
        "popularPercent": 1,
        "electoralVote": 0,
        "electoralPercent": 0,
        "index": 23
      },
      {
        "id": "Ind",
        "name": "Gary Johnson",
        "popularVote": 6557064,
        "popularPercent": 7,
        "electoralVote": 0,
        "electoralPercent": 0,
        "index": 24
      },
      {
        "id": "SEP",
        "name": "Jerry White",
        "popularVote": 162970,
        "popularPercent": 1,
        "electoralVote": 0,
        "electoralPercent": 0,
        "index": 25
      },
      {
        "id": "RP",
        "name": "Chuck Baldwin",
        "popularVote": 43566,
        "popularPercent": 1,
        "electoralVote": 0,
        "electoralPercent": 0,
        "index": 26
      },
      {
        "id": "Ind",
        "name": "Randall Terry",
        "popularVote": 178640,
        "popularPercent": 1,
        "electoralVote": 0,
        "electoralPercent": 0,
        "index": 27
      },
      {
        "id": "PSL",
        "name": "Gloria La Riva",
        "popularVote": 234118,
        "popularPercent": 1,
        "electoralVote": 0,
        "electoralPercent": 0,
        "index": 28
      }
    ]
  },
  "senate": {
    "name": "Control of Senate",
    "total": 100,
    "balance": 50,
    "undecided": 2,
    "parties": [
      {
        "id": "Dem",
        "seats": 52,
        "percent": 52,
        "delta": 1,
        "index": 0
      },
      {
        "id": "GOP",
        "seats": 46,
        "percent": 46,
        "delta": -1,
        "index": 1
      }
    ]
  },
  "house": {
    "name": "Control of House",
    "total": 435,
    "balance": 218,
    "undecided": 19,
    "parties": [
      {
        "id": "Dem",
        "seats": 181,
        "percent": 42,
        "delta": -9,
        "index": 0
      },
      {
        "id": "GOP",
        "seats": 235,
        "percent": 54,
        "delta": -5,
        "index": 1
      }
    ]
  },
  "governor": {
    "name": "Governors",
    "total": 50,
    "balance": 0,
    "undecided": 2,
    "parties": [
      {
        "id": "Dem",
        "seats": 18,
        "percent": 36,
        "delta": -2,
        "index": 0
      },
      {
        "id": "GOP",
        "seats": 29,
        "percent": 58,
        "delta": 0,
        "index": 1
      },
      {
        "id": "Ind",
        "seats": 1,
        "percent": 2,
        "delta": 0,
        "index": 2
      }
    ]
  }
};