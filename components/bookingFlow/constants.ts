export interface ServiceType {
    id: string
    name: string // translation key for the title
    description: string // translation key for the description
    price: string // dollars
    duration: string // e.g. "2–3 hours"
    features: string[] // translation keys for each feature
}

export const taxMap = {
    "PA": 0.06,
    "NJ": 0.06625,
    "DE": 0
}

// THE ORDER MATTERS!!!
export const serviceTypesDefaults: ServiceType[] = [
    {
        id: "REGULAR",
        name: "regularService",
        description: "regularServiceDesc",
        price: "",
        duration: "2–3 hours",
        features: ["weeklyService", "allRoomsCleaned"],
    },
    {
        id: "ENVIRONMENT",
        name: "environmentService",
        description: "environmentServiceDesc",
        price: "",
        duration: "3–4 hours",
        features: ["ecoFriendlyProducts", "sustainableMethods"],
    },
    {
        id: "DEEP",
        name: "deepService",
        description: "deepServiceDesc",
        price: "",
        duration: "4–5 hours",
        features: ["recommendedQuarterly", "hardToReachAreas"],
    },
    {
        id: "HAZMAT",
        name: "hazmatService",
        description: "hazmatServiceDesc",
        price: "",
        duration: "5–6 hours",
        features: ["certifiedTechnicians", "safetyProtocols"],
    },
    {
        id: "FIRE",
        name: "fireService",
        description: "fireServiceDesc",
        price: "",
        duration: "5–6 hours",
        features: ["smokeRemoval", "odorElimination"],
    },
    {
        id: "WATER",
        name: "waterService",
        description: "waterServiceDesc",
        price: "",
        duration: "5–6 hours",
        features: ["waterExtraction", "moldPrevention"],
    },
    {
        id: "MOVE_IN_OUT",
        name: "moveService",
        description: "moveServiceDesc",
        price: "",
        duration: "3–4 hours",
        features: ["oneTimeDeep", "applianceCleaning"],
    },
    {
        id: "DECEASED",
        name: "deceasedService",
        description: "deceasedServiceDesc",
        price: "",
        duration: "4–5 hours",
        features: ["discreetService", "thoroughSanitization"],
    },
    {
        id: "EXPLOSIVE_RESIDUE",
        name: "explosiveResidueService",
        description: "explosiveResidueServiceDesc",
        price: "",
        duration: "6–7 hours",
        features: ["expertTechnicians", "completeDecontamination"],
    },
    {
        id: "MOLD",
        name: "moldService",
        description: "moldServiceDesc",
        price: "",
        duration: "5–6 hours",
        features: ["moldTesting", "completeRemoval"],
    },
    {
        id: "CONSTRUCTION",
        name: "constructionService",
        description: "constructionServiceDesc",
        price: "",
        duration: "3–4 hours",
        features: ["debrisRemoval", "dustElimination"],
    },
    {
        id: "COMMERCIAL",
        name: "commercialService",
        description: "commercialServiceDesc",
        price: "",
        duration: "6–7 hours",
        features: ["afterHoursService", "customizedPlans"],
    },
    {
        id: "CUSTOM",
        name: "customService",
        description: "customServiceDesc",
        price: "",
        duration: "Varies",
        features: ["depositRequired", "onSiteAssessment", "balancePayment"]
    },
]

export interface FormErrors {
    firstName?: string
    lastName?: string
    email?: string
    phone?: string
    address?: string
    zipcode?: string
    squareFeet?: string
    state?: string
}

export function generateRequestId() {
    let result = ""
    for (let i = 0; i < 12; i++) {
        const randomByte = Math.floor(Math.random() * 256)
        result += ("0" + randomByte.toString(16)).slice(-2)
    }
    return result
}
