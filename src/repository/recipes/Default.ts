import { Recipe } from "~/models/recipe/Recipe";

export const defaultRecipe: Recipe = {
    "id": "vast_argument_756",
    "name": "Default",
    "description": "Targeted at salt & chlorine pools, this plan takes 6 readings & uses calcium hypochlorite as the sanitizer.",
    "ts": 1593550871334,
    "appVersion": "1.0.0",
    "readings": [
        {
            "name": "Free Chlorine",
            "var": "fc",
            "sliderMin": 0,
            "sliderMax": 7,
            "idealMin": 2,
            "idealMax": 4,
            "type": "number",
            "decimalPlaces": 1,
            "units": "ppm",
            "defaultValue": 3
        },
        {
            "name": "Total Chlorine",
            "var": "tc",
            "sliderMin": 0,
            "sliderMax": 10,
            "idealMin": 0,
            "idealMax": 0,
            "type": "number",
            "decimalPlaces": 1,
            "units": "ppm",
            "defaultValue": 0
        },
        {
            "name": "pH",
            "var": "ph",
            "sliderMin": 3,
            "sliderMax": 10,
            "idealMin": 7.2,
            "idealMax": 7.61,
            "type": "number",
            "decimalPlaces": 1,
            "units": "",
            "defaultValue": 7.4
        },
        {
            "name": "Total Alkalinity",
            "var": "ta",
            "sliderMin": 50,
            "sliderMax": 150,
            "idealMin": 80,
            "idealMax": 120,
            "type": "number",
            "decimalPlaces": 0,
            "units": "ppm",
            "defaultValue": 99.7
        },
        {
            "name": "Calcium Hardness",
            "var": "ch",
            "sliderMin": 0,
            "sliderMax": 600,
            "idealMin": 200,
            "idealMax": 400,
            "type": "number",
            "decimalPlaces": 0,
            "units": "ppm",
            "defaultValue": 299.8
        },
        {
            "name": "Cyanuric Acid",
            "var": "cya",
            "sliderMin": 0,
            "sliderMax": 80,
            "idealMin": 30,
            "idealMax": 50,
            "type": "number",
            "decimalPlaces": 0,
            "units": "ppm",
            "defaultValue": 40.1
        }
    ],
    "treatments": [
        {
            "name": "Calcium Hypochlorite",
            "var": "calc_hypo",
            "formula": "// This target is initialized with a \"let\" because I might change it later.\nlet fcTarget = 3.0;\n\n// If we need to shock, adjust the target to breakpoint chloriniation:\nconst combined = r.tc - r.fc;\nif (combined > 0.11) {\n    const breakpoint = combined * 10;\n    fcTarget = breakpoint;\n}\n\n// If the free chlorine is already above the target, we don't need to add any more!\nif (r.fc >= fcTarget) {\n    return 0;\n}\n\n// If we've made it this far, then we probably need to add some chlorine.\n// Let's figure out how much:\nconst fcDelta = fcTarget - r.fc;\n\n// This number is more art than science. It's the approximate ounces of <chemical>\n// required to adjust the measurement by 1ppm in a 1 gallon pool.\n// The stronger a chemical is, the lower this number will be.\nconst calcHypo67Multiplier = .000208;\n\n// We account for the pool's volume, the desired change, and the chemical's... potency?\nreturn p.gallons * fcDelta * calcHypo67Multiplier;",
            "type": "dryChemical",
            "concentration": 67
        },
        {
            "name": "Sodium Carbonate",
            "var": "soda_ash",
            "formula": "// If the ph is already high enough, we don't need any soda ash.\nif (r.ph >= 7.2) {\n    return 0;\n}\n\n// Aim for a pH of... 7.4?\nconst pHDelta = 7.4 - r.ph;\n\n// This is lazy & unscientific... we just set a cap,\n// because we don't want to use too much of this stuff.\nconst maxAmount = p.gallons * .0048;\n\n\n// This is interesting -- the effect of adding a chemical to increase\n// the pH isn't \"linear\", but instead the measure will asymptotically approach\n// some pH, depending on what chemical you add.\n\n// In other words, the multiplier actually changes based on the pH measure.\n// This is just a rough approximation grabbed out of thin air -- if anyone\n// wants to \"remix\" this recipe with a better one, please do! We can use\n// sophisticated operators like Math.log(), I just don't do it yet...\nconst sodaAshMultiplier = .00035 * (r.ph + 1);\n\nconst calculatedAmount = p.gallons * pHDelta * sodaAshMultiplier;\n\n// Return the lower of the 2 numbers:\nreturn Math.min(calculatedAmount, maxAmount);",
            "type": "dryChemical",
            "concentration": 100
        },
        {
            "name": "Sodium Bicarbonate",
            "var": "baking_soda",
            "formula": "// If the TA is already in good range, don't add any baking soda\nif (r.ta >= 80) {\n    return 0;\n}\n\n// Otherwise, shoot for the middle of the ideal range:\nlet taDelta = 100 - r.ta;\n\n// Remember, soda ash (from the previous step) also affects the TA,\n// so we should calculate how much (if any) the soda ash has\n// already moved the TA & offset our new delta accordingly:\nconst sodaAshMultiplierForTA = .00014;\nconst taIncreaseFromSodaAsh = t.soda_ash / (sodaAshMultiplierForTA * p.gallons);\n\nif (taIncreaseFromSodaAsh >= taDelta) {\n  return 0;\n}\ntaDelta = taDelta - taIncreaseFromSodaAsh;\n\n// Now, calculate the amount of baking soda necessary to close the remaining gap.\nconst bakingSodaTAMultiplier = .000224;\nreturn p.gallons * taDelta * bakingSodaTAMultiplier;\n\n// NOTE: this ignores some complications. For instance, this new dose of\n// baking soda will also raise the pH, and could knock it above the ideal range.\n// If anyone wants to remix this recipe to account for this, you would be a hero.",
            "type": "dryChemical",
            "concentration": 100
        },
        {
            "name": "Muriatic Acid",
            "var": "m_acid",
            "formula": "// Muriatic Acid helps to lower the pH. I personally don't like\n// how the acid makes the water slimy & unswimmable for a few hours...\n// but meh.\n\n// If the pH isn't too high... then don't worry about it!\nif (r.ph < 7.6) {\n  return 0;\n}\n\nconst targetPh = 7.4;\nconst phDelta = targetPh - r.ph;    // This will be a negative number.\n\n// This is not very precise, feel free to remix. It's another non-linear effect,\n// where the multiplier is different depending on the measure.\nlet multiplier = 0;\n\nif (r.ph > 8.2) {\n    multiplier = -.0027;\n}\nelse if (r.ph > 8.0) {\n    multiplier = -.0028;\n}\nelse if (r.ph > 7.8) {\n    multiplier = -.0029;\n}\nelse if (r.ph > 7.6) {\n    multiplier = -.0030;\n}\n\n// Cap the total amount of acid, just in-case someone enters a pH of 100 somehow:\nconst maxAmount = .0032 * p.gallons;\nconst calculatedAmount = p.gallons * phDelta * multiplier;\n\nreturn Math.min(maxAmount, calculatedAmount);",
            "type": "liquidChemical",
            "concentration": 31
        },
        {
            "name": "Calcium Chloride",
            "var": "cal_chlor",
            "formula": "// If the calcium hardness is above 200, we don't need to add any calcium chloride.\nif (r.ch >= 200) {\n    return 0;\n}\n\nconst delta = 250 - r.ch;\nconst multiplier = .000144;\n\nreturn p.gallons * delta * multiplier;",
            "type": "dryChemical",
            "concentration": 100
        },
        {
            "name": "Cyanuric Acid",
            "var": "cya",
            "formula": "if (r.cya >= 30) {\n    return 0;\n}\n\nconst delta = 40 - r.cya;\nconst multiplier = .00013;\n\nreturn p.gallons * delta * multiplier;",
            "type": "dryChemical",
            "concentration": 100
        }
    ]
};