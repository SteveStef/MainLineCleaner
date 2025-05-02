import { Clock, Shield, Award, Users, Droplets, Flame, Home, Wind, Skull, Bomb, Building, Briefcase } from 'lucide-react'
import fire from "../../../images/services/fire-damage.jpg";
import regular from "../../../images/services/regular.jpg";
import deep from "../../../images/services/deep.jpg";
import enviroment from "../../../images/services/enviroment.jpg";
import hazmat from "../../../images/services/haz.jpg";
import water from "../../../images/services/water.jpg";
import move from "../../../images/services/move.jpg";
import deceased from "../../../images/services/deceased.jpg"
import explosive from "../../../images/services/explosive.jpg";
import commercial from "../../../images/services/commercial.jpg";
import mold from "../../../images/services/mold.jpg";
import construction from "../../../images/services/construction.jpg";

const serviceInfo = {
  REGULAR: {
    cleaning: {
      image: regular,
      title: "Regular Cleaning Services",
      shortDesc:
        "Standard cleaning services for homes and businesses, providing consistent maintenance and cleanliness.",
      longDesc:
        "Our regular cleaning services provide reliable, consistent maintenance for your home or business. We focus on keeping your spaces clean, fresh, and welcoming with routine cleaning that addresses common areas, surfaces, and fixtures. Our professional team follows a systematic approach to ensure no detail is overlooked, using eco-friendly products and efficient techniques to deliver exceptional results on a regular schedule that works for you.",
      features: [
        {
          title: "Systematic cleaning of all common areas and surfaces",
          description:
            "We follow a room-to-room checklist to ensure no corner is missed and every surface is thoroughly cleaned.",
        },
        {
          title:
            "Dusting and wiping of furniture, fixtures, and accessible surfaces",
          description:
            "Our team uses microfiber cloths to remove dust and fingerprints without scratching delicate finishes.",
        },
        {
          title: "Vacuuming and mopping of floors",
          description:
            "We select the appropriate vacuum and mop techniques to leave carpets, tile, and hardwood spotless.",
        },
        {
          title: "Cleaning and sanitizing of bathrooms and kitchens",
          description:
            "High-traffic areas receive hospital-grade disinfectants to kill germs and remove soap scum.",
        },
        {
          title: "Emptying trash and replacing liners",
          description:
            "Trash bins are emptied, sanitized, and fitted with fresh liners to prevent odors and bacteria.",
        },
        {
          title: "Spot cleaning of doors, frames, and light switches",
          description:
            "We target high-touch points with antibacterial wipes to reduce the spread of germs.",
        },
        {
          title: "Cleaning of mirrors and glass surfaces",
          description:
            "Glass cleaners and squeegees leave windows and mirrors streak-free and crystal clear.",
        },
        {
          title: "Straightening and organizing of common areas",
          description:
            "We align cushions, fold throws, and tidy décor for a neat, welcoming presentation.",
        },
        {
          title: "Removal of cobwebs and surface dust",
          description:
            "Telescoping dusters reach ceiling corners and light fixtures to eliminate cobwebs.",
        },
        {
          title: "Eco-friendly cleaning products for a healthy environment",
          description:
            "All our solutions are biodegradable and free of harsh chemicals, ensuring safety for people and pets.",
        },
      ],
      process: [
        "Initial Consultation and Assessment",
        "Customized Cleaning Plan Development",
        "Professional Cleaning Execution",
        "Quality Inspection and Client Feedback",
      ],
      benefits: [
        {
          title: "Consistent Cleanliness",
          description:
            "Maintain a consistently clean and welcoming environment with regular professional service.",
          icon: Clock,
        },
        {
          title: "Healthier Living and Working Spaces",
          description:
            "Reduce allergens, dust, and common contaminants for improved indoor air quality and overall health.",
          icon: Shield,
        },
        {
          title: "Time-Saving Convenience",
          description:
            "Free up your valuable time for more important activities while we handle the routine cleaning tasks.",
          icon: Award,
        },
        {
          title: "Customized Cleaning Solutions",
          description:
            "Receive personalized service that addresses your specific cleaning needs and preferences.",
          icon: Users,
        },
      ],
      faqs: [
        {
          question: "How often should I schedule regular cleaning services?",
          answer:
            "The frequency depends on your specific needs and the level of traffic in your space. Many clients opt for weekly or bi-weekly service, while others with lower traffic may choose monthly cleaning. We can help determine the optimal frequency during our initial consultation.",
        },
        {
          question: "What areas are typically included in regular cleaning?",
          answer:
            "Regular cleaning typically includes common areas, kitchens, bathrooms, living rooms, bedrooms, and offices. We dust surfaces, vacuum and mop floors, clean and sanitize bathrooms and kitchens, empty trash, and ensure your space looks neat and tidy.",
        },
        {
          question: "How long does a regular cleaning service take?",
          answer:
            "The duration depends on the size of your space and the specific cleaning requirements. On average, a regular cleaning for a standard home or small office takes between 2–4 hours. We can provide a more accurate estimate after assessing your specific space.",
        },
        {
          question: "Do I need to provide cleaning supplies?",
          answer:
            "No, our professional team brings all necessary cleaning supplies, equipment, and products. We use eco-friendly, high-quality cleaning solutions that are effective yet safe for your family, pets, and the environment.",
        },
        {
          question: "What if I need to reschedule my regular cleaning?",
          answer:
            "We understand that schedules can change. Please notify us at least 48 hours in advance if you need to reschedule, and we'll be happy to accommodate your request based on availability.",
        },
      ],
      testimonials: [
        {
          name: "Emily Johnson",
          role: "Homeowner",
          rating: 5,
          comment:
            "Their regular cleaning service has been a game-changer for our busy household. The team is professional, thorough, and consistent. Our home always feels fresh and welcoming after their visits!",
        },
        {
          name: "Michael Thompson",
          role: "Small Business Owner",
          rating: 5,
          comment:
            "We've been using their regular cleaning service for our office for over a year, and the quality has never wavered. Our workspace is always immaculate, which creates a positive environment for both our team and clients.",
        },
        {
          name: "Jennifer Davis",
          role: "Working Professional",
          rating: 4,
          comment:
            "As someone with a hectic schedule, their regular cleaning service has been invaluable. They're reliable, efficient, and pay attention to the details that matter. Highly recommended!",
        },
      ],
    },
  },

  ENVIRONMENT: {
    cleaning: {
      image: enviroment,
      title: "Environmental Cleaning Services",
      shortDesc:
        "Eco-friendly cleaning solutions that protect both your space and the planet, using sustainable practices and products.",
      longDesc:
        "Our environmental cleaning services combine effective cleaning with ecological responsibility. We understand the importance of maintaining clean, healthy spaces while minimizing environmental impact. Our specialized team uses certified green cleaning products, sustainable practices, and energy-efficient equipment to deliver exceptional results that are safe for your family, pets, employees, and the planet. We prioritize biodegradable, non-toxic solutions that effectively clean and sanitize without harmful chemicals or residues.",
      features: [
        {
          title: "Certified eco-friendly and biodegradable cleaning products",
          description:
            "We use only Green Seal, EcoLogo, and EPA-Safer Choice certified products that break down naturally.",
        },
        {
          title: "Sustainable cleaning practices that reduce environmental impact",
          description:
            "Our methods minimize water and chemical use, protecting resources and the planet.",
        },
        {
          title:
            "Microfiber technology that minimizes water and chemical usage",
          description:
            "Microfiber cloths and mops capture dirt with less moisture, reducing runoff.",
        },
        {
          title: "HEPA filtration vacuums for improved air quality",
          description:
            "Our vacuums trap 99.97% of airborne particles, lowering allergens and dust.",
        },
        {
          title: "Water-conserving cleaning techniques",
          description:
            "We employ spray-and-wipe methods that use up to 80% less water than traditional mopping.",
        },
        {
          title: "Reduced packaging waste through concentrate systems",
          description:
            "Concentrate refills cut down on plastic containers and transportation emissions.",
        },
        {
          title: "Non-toxic disinfection and sanitization methods",
          description:
            "Our plant-based disinfectants kill germs without harsh chemical vapors.",
        },
        {
          title: "Energy-efficient equipment and practices",
          description:
            "We choose machines with Energy Star ratings and run them only when needed.",
        },
        {
          title: "Proper disposal and recycling of cleaning waste",
          description:
            "We separate recyclables, compostables, and hazardous waste per local regulations.",
        },
        {
          title: "Indoor air quality improvement strategies",
          description:
            "We combine filtration, ventilation, and low-VOC products for cleaner air indoors.",
        },
      ],
      process: [
        "Environmental Assessment and Consultation",
        "Green Cleaning Plan Development",
        "Eco-Friendly Cleaning Execution",
        "Quality and Environmental Impact Evaluation",
      ],
      benefits: [
        {
          title: "Healthier Indoor Environment",
          description:
            "Eliminate toxic chemicals and improve indoor air quality for healthier living and working spaces.",
          icon: Wind,
        },
        {
          title: "Reduced Environmental Footprint",
          description:
            "Minimize environmental impact through sustainable products, practices, and waste reduction.",
          icon: Shield,
        },
        {
          title: "Safe for Vulnerable Populations",
          description:
            "Protect children, pets, elderly, and those with allergies or sensitivities from harsh chemical exposure.",
          icon: Users,
        },
        {
          title: "Sustainable Cleanliness",
          description:
            "Achieve exceptional cleaning results while supporting environmental conservation efforts.",
          icon: Award,
        },
      ],
      faqs: [
        {
          question: "Are eco-friendly cleaning products as effective as conventional ones?",
          answer:
            "Yes, our certified green cleaning products are formulated to be as effective as conventional cleaners while eliminating toxic chemicals. Modern eco-friendly formulations have advanced significantly and can handle tough cleaning challenges without compromising on results or environmental responsibility.",
        },
        {
          question: "What certifications do your green cleaning products have?",
          answer:
            "We use products certified by recognized environmental organizations such as Green Seal, EcoLogo, EPA Safer Choice, and USDA BioPreferred. These certifications ensure that the products meet strict environmental and performance standards.",
        },
        {
          question: "How does environmental cleaning improve indoor air quality?",
          answer:
            "Conventional cleaning products often contain volatile organic compounds (VOCs) that can contribute to indoor air pollution. Our environmental cleaning eliminates these harmful chemicals, uses HEPA filtration vacuums to remove allergens and particulates, and implements practices that reduce airborne contaminants, resulting in significantly improved indoor air quality.",
        },
        {
          question: "Is environmental cleaning more expensive than conventional cleaning?",
          answer:
            "While some green products may have a slightly higher initial cost, our environmental cleaning services are competitively priced. When considering the long-term benefits—including health improvements, reduced sick days, and environmental preservation—many clients find environmental cleaning to be a valuable investment.",
        },
        {
          question: "Can environmental cleaning address specific allergies or sensitivities?",
          answer:
            "Yes, our environmental cleaning services are ideal for individuals with allergies, asthma, chemical sensitivities, or other health concerns. We can customize our approach to address specific health requirements, using hypoallergenic products and specialized techniques to create a safer, healthier environment.",
        },
      ],
      testimonials: [
        {
          name: "Laura Peterson",
          role: "Parent of Children with Allergies",
          rating: 5,
          comment:
            "Their environmental cleaning service has made a remarkable difference for our family. My children's allergy symptoms have significantly decreased, and I love knowing our home is clean without harmful chemicals.",
        },
        {
          name: "Robert Chen",
          role: "Sustainable Business Owner",
          rating: 5,
          comment:
            "As a business committed to sustainability, finding a cleaning service that aligns with our values was essential. Their environmental cleaning not only maintains our eco-friendly standards but delivers exceptional results.",
        },
        {
          name: "Sophia Martinez",
          role: "Healthcare Professional",
          rating: 4,
          comment:
            "I'm impressed with the thoroughness of their environmental cleaning. As someone who understands the health impacts of chemicals, I appreciate their commitment to effective, non-toxic cleaning solutions.",
        },
      ],
    },
  },

  DEEP: {
    cleaning: {
      image: deep,
      title: "Deep Cleaning Services",
      shortDesc:
        "Intensive cleaning solutions that reach beyond the surface to eliminate built-up dirt, grime, and contaminants.",
      longDesc:
        "Our deep cleaning services provide comprehensive, intensive cleaning that goes far beyond regular maintenance. We target accumulated dirt, grime, bacteria, and allergens in hard-to-reach areas that are often overlooked during routine cleaning. Using specialized equipment, techniques, and cleaning agents, our professional team thoroughly cleans every accessible surface and area, from baseboards and light fixtures to appliances and ventilation systems. Deep cleaning revitalizes your space, improves indoor air quality, and creates a healthier environment.",
      features: [
        {
          title:
            "Comprehensive cleaning of all surfaces, fixtures, and accessible areas",
          description:
            "We tackle every inch—from countertops to vents—to remove embedded dirt and buildup.",
        },
        {
          title: "Detailed attention to baseboards, crown molding, and trim",
          description:
            "Our crew scrubs and wipes these outline features to restore a pristine finish.",
        },
        {
          title: "Deep cleaning of kitchen appliances, inside and out",
          description:
            "We degrease cabinet fronts and interiors of stoves, microwaves, and refrigerators.",
        },
        {
          title: "Thorough bathroom sanitization, including grout and tile",
          description:
            "High-power steam and brushes eliminate mold, soap scum, and mineral deposits.",
        },
        {
          title:
            "Cleaning behind and under furniture and appliances where possible",
          description:
            "We move lightweight items and extend dusters to reach hidden spaces.",
        },
        {
          title:
            "Detailed dusting of ceiling fans, light fixtures, and vents",
          description:
            "Extendable dusters and vacuums clear bulbs and blades of accumulated dust.",
        },
        {
          title: "Window cleaning, including tracks and sills",
          description:
            "We scrub and flush debris from tracks to ensure smooth sliding and clear views.",
        },
        {
          title: "Deep carpet and upholstery cleaning",
          description:
            "Hot-water extraction lifts stains and allergens deep within fibers.",
        },
        {
          title: "Cabinet and drawer cleaning, inside and out",
          description:
            "We empty, dust, and wipe each compartment for a fresh, organized interior.",
        },
        {
          title:
            "Scale and mineral deposit removal from fixtures and surfaces",
          description:
            "Specialized descalers dissolve buildup on faucets, shower heads, and drains.",
        },
      ],
      process: [
        "Comprehensive Assessment and Planning",
        "Detailed Deep Cleaning Plan Development",
        "Intensive Cleaning Execution",
        "Thorough Inspection and Quality Assurance",
      ],
      benefits: [
        {
          title: "Elimination of Hidden Contaminants",
          description:
            "Remove accumulated dirt, allergens, and bacteria from areas missed during regular cleaning.",
          icon: Shield,
        },
        {
          title: "Revitalized Living or Working Space",
          description:
            "Experience the difference of a thoroughly cleaned environment that looks, smells, and feels fresh.",
          icon: Wind,
        },
        {
          title: "Extended Longevity of Surfaces and Materials",
          description:
            "Prevent damage and deterioration caused by built-up grime and contaminants.",
          icon: Clock,
        },
        {
          title: "Improved Indoor Air Quality",
          description:
            "Reduce allergens, dust, and pollutants that affect respiratory health and overall wellbeing.",
          icon: Users,
        },
      ],
      faqs: [
        {
          question: "How often should I schedule deep cleaning services?",
          answer:
            "Most homes and businesses benefit from deep cleaning 2–4 times per year, depending on factors such as traffic, occupancy, and specific environmental conditions. Spaces with high traffic, pets, children, or specific health concerns may require more frequent deep cleaning.",
        },
        {
          question: "How long does a deep cleaning service take?",
          answer:
            "Deep cleaning is much more time-intensive than regular cleaning. Depending on the size and condition of your space, deep cleaning typically takes between 5–10 hours and may require a team of cleaning professionals. For larger spaces or those with significant buildup, the service might be scheduled across multiple days.",
        },
        {
          question: "What's the difference between regular cleaning and deep cleaning?",
          answer:
            "Regular cleaning focuses on maintaining cleanliness through routine tasks like dusting, vacuuming, and surface cleaning. Deep cleaning is a more intensive process that addresses built-up dirt and grime in areas that aren't covered during regular cleaning, such as behind appliances, inside cabinets, baseboards, ceiling fans, window tracks, and more.",
        },
        {
          question: "Should I prepare my space before a deep cleaning service?",
          answer:
            "To maximize the effectiveness of deep cleaning, we recommend clearing clutter, removing personal items from surfaces, and ensuring access to areas that need cleaning. This allows our team to focus on the intensive cleaning tasks rather than organizing or moving items. We'll provide specific preparation guidelines before your scheduled service.",
        },
        {
          question: "Can deep cleaning remove tough stains and buildup?",
          answer:
            "Yes, our deep cleaning service is specifically designed to address tough stains, mineral buildup, soap scum, grease accumulation, and other stubborn cleaning challenges. We use specialized products and techniques to tackle these issues effectively. While some extremely set-in stains may not be completely removable, our deep cleaning significantly improves the appearance and cleanliness of most surfaces.",
        },
      ],
      testimonials: [
        {
          name: "Rebecca Wilson",
          role: "Homeowner",
          rating: 5,
          comment:
            "I was amazed at the difference their deep cleaning service made in our home. Areas I didn't even realize were dirty are now spotless. It truly feels like a new house!",
        },
        {
          name: "James Anderson",
          role: "Restaurant Owner",
          rating: 5,
          comment:
            "We schedule quarterly deep cleaning for our restaurant, and it's been essential for maintaining our high standards. They reach areas our daily cleaning can't cover, and the results are always impressive.",
        },
        {
          name: "Olivia Garcia",
          role: "Property Manager",
          rating: 4,
          comment:
            "Their deep cleaning service is our go-to for apartment turnovers. They transform spaces that have seen years of use, making them ready for new tenants. The attention to detail is exceptional.",
        },
      ],
    },
  },

  HAZMAT: {
    cleaning: {
      image: hazmat,
      title: "Hazardous Materials Cleaning Services",
      shortDesc:
        "Specialized cleaning and decontamination services for environments affected by hazardous materials, ensuring safety and compliance.",
      longDesc:
        "Our hazardous materials cleaning services provide expert decontamination and remediation for environments affected by chemical spills, biological hazards, and other dangerous substances. Our certified technicians are trained in proper hazardous material handling, using specialized equipment, protective gear, and industry-approved techniques to safely remove and dispose of hazardous materials. We strictly adhere to OSHA, EPA, and other regulatory guidelines to ensure complete decontamination while protecting human health and the environment.",
      features: [
        {
          title:
            "Certified hazardous materials technicians with specialized training",
          description:
            "Our team holds HAZWOPER and OSHA certifications to handle dangerous substances safely.",
        },
        {
          title: "Comprehensive assessment and hazard identification",
          description:
            "We map contamination levels and identify all risk factors before cleaning begins.",
        },
        {
          title: "Proper containment and isolation of affected areas",
          description:
            "Containment barriers and negative air pressure prevent cross-contamination.",
        },
        {
          title: "Safe removal and disposal of hazardous materials",
          description:
            "We package, label, and transport waste to licensed disposal facilities.",
        },
        {
          title: "Specialized cleaning agents and neutralizers for specific contaminants",
          description:
            "Customized chemical agents neutralize toxins without damaging surfaces.",
        },
        {
          title: "Advanced personal protective equipment (PPE) for technician safety",
          description:
            "Full-body suits, respirators, and gloves protect against chemical exposure.",
        },
        {
          title: "Decontamination of affected surfaces and materials",
          description:
            "We scrub, rinse, and validate cleanliness on floors, walls, and equipment.",
        },
        {
          title: "Air quality testing and monitoring",
          description:
            "Continuous monitoring ensures safe breathing zones during and after remediation.",
        },
        {
          title:
            "Proper documentation and reporting for compliance purposes",
          description:
            "Detailed logs and photos meet OSHA, EPA, and insurance requirements.",
        },
        {
          title: "Post-remediation verification testing",
          description:
            "Surface and air samples confirm that contamination has been fully removed.",
        },
      ],
      process: [
        "Hazard Assessment and Safety Planning",
        "Containment and Remediation Strategy Development",
        "Safe Hazardous Material Removal and Cleaning",
        "Testing and Verification of Decontamination",
      ],
      benefits: [
        {
          title: "Expert Hazard Management",
          description:
            "Professional handling of dangerous materials by certified technicians trained in hazardous substance remediation.",
          icon: Shield,
        },
        {
          title: "Regulatory Compliance",
          description:
            "Adherence to all applicable regulations and guidelines for hazardous material handling and disposal.",
          icon: Award,
        },
        {
          title: "Comprehensive Decontamination",
          description:
            "Complete removal of hazardous substances and thorough cleaning to restore safety to the environment.",
          icon: Users,
        },
        {
          title: "Documentation and Certification",
          description:
            "Proper documentation of the remediation process for insurance, legal, or regulatory requirements.",
          icon: Briefcase,
        },
      ],
      faqs: [
        {
          question: "What types of hazardous materials can you handle?",
          answer:
            "Our certified technicians are trained to handle a wide range of hazardous materials, including chemical spills, biological contaminants, industrial waste, certain types of asbestos, lead dust, mercury, and other toxic substances. Each hazardous material requires specific handling protocols, which our team is thoroughly trained to implement.",
        },
        {
          question: "How do you ensure safety during hazardous material cleaning?",
          answer:
            "Safety is our top priority. We implement strict safety protocols including proper containment of the affected area, use of appropriate personal protective equipment (PPE), specialized ventilation and air filtration, proper decontamination procedures, and continuous monitoring. Our technicians are certified in hazardous material handling and follow all OSHA and EPA guidelines.",
        },
        {
          question: "What certifications do your hazardous material technicians have?",
          answer:
            "Our technicians hold various certifications depending on their specialization, including HAZWOPER (Hazardous Waste Operations and Emergency Response), OSHA Hazardous Materials certifications, EPA certifications for specific substances, and industry-specific training for biological and chemical hazards. We ensure all technicians receive regular updated training.",
        },
        {
          question: "How is hazardous waste disposed of after cleaning?",
          answer:
            "We follow strict protocols for hazardous waste disposal in accordance with local, state, and federal regulations. This typically involves proper containment, labeling, transportation by licensed carriers, and disposal at authorized facilities. We provide complete documentation of the disposal process for your records and regulatory compliance.",
        },
        {
          question: "Do you provide testing to verify complete decontamination?",
          answer:
            "Yes, we conduct post-remediation verification testing to ensure that all hazardous materials have been properly removed and the area is safe for reoccupation. Depending on the type of hazard, this may include surface wipe testing, air quality testing, or other specialized testing methods. We provide detailed reports of all testing results.",
        },
      ],
      testimonials: [
        {
          name: "Dr. Thomas Reynolds",
          role: "Laboratory Director",
          rating: 5,
          comment:
            "After a chemical spill in our research facility, their hazardous materials team responded quickly and professionally. Their methodical approach to containment and cleanup was impressive, and their documentation was thorough for our compliance requirements.",
        },
        {
          name: "Maria Sanchez",
          role: "Industrial Safety Manager",
          rating: 5,
          comment:
            "We've contracted their hazmat cleaning services for several incidents, and they consistently demonstrate expertise and professionalism. Their team's knowledge of regulations and safety protocols gives us confidence in their work.",
        },
        {
          name: "Robert Chen",
          role: "Property Owner",
          rating: 4,
          comment:
            "When we discovered hazardous materials during a renovation, their team provided expert guidance and remediation. They handled a complex situation efficiently and ensured the property was safe for continued work.",
        },
      ],
    },
  },

  FIRE: {
    cleaning: {
      image: fire,
      title: "Fire Damage Cleaning Services",
      shortDesc:
        "Specialized restoration and cleaning services for properties affected by fire and smoke damage.",
      longDesc:
        "Our fire damage cleaning services provide comprehensive restoration for properties affected by fire, smoke, and soot damage. We understand the devastating impact of fire and the complex cleaning challenges it presents. Our specialized team employs advanced techniques, equipment, and cleaning agents to remove soot, eliminate smoke odors, clean affected surfaces, and restore your property. We work efficiently to mitigate secondary damage while providing compassionate service during a difficult time.",
      features: [
        {
          title: "Emergency response and damage assessment",
          description:
            "We arrive quickly after a fire event to evaluate structural and cosmetic damage before cleaning.",
        },
        {
          title: "Comprehensive soot and smoke residue removal",
          description:
            "Industrial vacuums and dry-sponges eliminate corrosive soot from all surfaces.",
        },
        {
          title: "Specialized cleaning for different types of smoke damage",
          description:
            "We tailor methods to protein-based, wet, or dry smoke residues for optimal results.",
        },
        {
          title: "Advanced odor neutralization techniques",
          description:
            "Ozone generators, thermal foggers, and hydroxyl treatments eradicate smoke odors at the molecular level.",
        },
        {
          title: "Cleaning and restoration of salvageable items",
          description:
            "We pack out, clean, and inventory belongings to recover valuables wherever possible.",
        },
        {
          title: "Structural cleaning and deodorization",
          description:
            "Walls, ceilings, and ductwork are cleaned and sealed to prevent odor re-emergence.",
        },
        {
          title: "HVAC system cleaning to remove smoke particles",
          description:
            "Air ducts, vents, and coils are dismantled and cleaned to restore fresh airflow.",
        },
        {
          title:
            "Content cleaning and pack-out services when needed",
          description:
            "Delicate items receive specialized on-site or off-site treatment for smoke and soot removal.",
        },
        {
          title:
            "Water damage remediation from firefighting efforts",
          description:
            "We extract excess water, dry structures, and apply antimicrobials to prevent mold.",
        },
        {
          title: "Coordination with insurance companies",
          description:
            "Detailed scope of work, photos, and itemized costs simplify your claims process.",
        },
      ],
      process: [
        "Emergency Assessment and Damage Evaluation",
        "Comprehensive Restoration Plan Development",
        "Specialized Fire Damage Cleaning and Restoration",
        "Final Inspection and Quality Verification",
      ],
      benefits: [
        {
          title: "Comprehensive Fire Damage Restoration",
          description:
            "Address all aspects of fire damage, including soot, smoke, odor, and water damage from firefighting efforts.",
          icon: Flame,
        },
        {
          title: "Prevention of Secondary Damage",
          description:
            "Quick, effective intervention to prevent additional damage from soot acidity and smoke particles.",
          icon: Shield,
        },
        {
          title: "Odor Elimination",
          description:
            "Complete removal of smoke odors using advanced deodorization techniques, not just masking smells.",
          icon: Wind,
        },
        {
          title: "Salvage and Restoration",
          description:
            "Professional cleaning and restoration of affected items and materials that might otherwise be discarded.",
          icon: Award,
        },
      ],
      faqs: [
        {
          question: "How quickly should fire damage cleaning begin?",
          answer:
            "Fire damage cleaning should begin as soon as the property is declared safe to enter. Immediate intervention is crucial because soot and smoke residues are acidic and can cause progressive damage to surfaces and materials. Additionally, smoke odors become more difficult to remove the longer they remain. We offer emergency response services to begin the restoration process quickly.",
        },
        {
          question: "Can you remove smoke odor completely?",
          answer:
            "Yes, we can completely remove smoke odors in most situations. We use a multi-faceted approach including air scrubbing, HEPA filtration, thermal fogging, ozone or hydroxyl treatments, and specialized cleaning agents designed to neutralize odor molecules rather than mask them. Our comprehensive approach addresses odors embedded in structural materials, HVAC systems, and contents.",
        },
        {
          question: "How do you clean different types of smoke damage?",
          answer:
            "Different types of fires (high-heat, slow-smoldering, protein-based, etc.) produce different types of smoke residues that require specific cleaning approaches. We identify the type of smoke damage present and use appropriate cleaning methods and agents for each affected surface. For example, dry cleaning sponges for dry smoke, degreasing agents for protein residues, and specialized approaches for different materials and surfaces.",
        },
        {
          question: "What items can be salvaged after fire damage?",
          answer:
            "Many items can be salvaged with proper cleaning techniques, though this depends on the severity of the damage and the nature of the items. Hard surfaces, non-porous items, and textiles often respond well to professional cleaning. Electronics, photographs, documents, and artwork may require specialized restoration. We conduct a thorough assessment to identify salvageable items and recommend appropriate restoration methods.",
        },
        {
          question: "Do you work with insurance companies for fire damage claims?",
          answer:
            "Yes, we regularly work with insurance companies and can assist with the claims process. We provide detailed documentation, including photographs, inventory lists, and itemized cleaning and restoration costs. Our experienced team understands insurance requirements and can communicate directly with adjusters to streamline the process while ensuring you receive the coverage you're entitled to.",
        },
      ],
      testimonials: [
        {
          name: "Jennifer and David Wilson",
          role: "Homeowners",
          rating: 5,
          comment:
            "After a devastating kitchen fire, their team restored our home beyond our expectations. They were compassionate, thorough, and skilled at removing all traces of smoke damage. We couldn't believe they were able to save so many of our belongings.",
        },
        {
          name: "Mark Thompson",
          role: "Restaurant Owner",
          rating: 5,
          comment:
            "When our restaurant suffered fire damage, their quick response and expertise were invaluable. They worked efficiently to clean and deodorize the space, allowing us to reopen much sooner than we expected. Their knowledge of commercial restoration was impressive.",
        },
        {
          name: "Sarah Johnson",
          role: "Property Manager",
          rating: 4,
          comment:
            "Their fire damage cleaning team handled a complex apartment restoration professionally and thoroughly. They coordinated well with insurance and kept the process moving smoothly. The residents were pleased with the final results.",
        },
      ],
    },
  },

  WATER: {
    cleaning: {
      image: water,
      title: "Water Damage Cleaning Services",
      shortDesc:
        "Emergency water extraction, drying, and restoration services for properties affected by water damage.",
      longDesc:
        "Our water damage cleaning services provide rapid response and comprehensive restoration for properties affected by flooding, leaks, and water intrusion. We understand that quick action is essential to prevent secondary damage such as mold growth and structural deterioration. Our certified technicians use industrial-grade equipment to extract water, thoroughly dry affected areas, clean and sanitize surfaces, and restore your property to its pre-loss condition. We handle everything from minor leaks to major flooding events with expertise and efficiency.",
      features: [
        {
          title: "24/7 emergency water extraction services",
          description:
            "Our team uses industrial pumps to remove standing water within the first critical hours.",
        },
        {
          title: "Advanced moisture detection and monitoring",
          description:
            "We employ thermal imaging and moisture meters to pinpoint and track damp areas.",
        },
        {
          title: "Industrial-grade drying equipment deployment",
          description:
            "High-capacity dehumidifiers and air movers speed up drying and prevent mold.",
        },
        {
          title: "Antimicrobial application to prevent mold growth",
          description:
            "We apply EPA-registered agents to inhibit microbial growth on wet surfaces.",
        },
        {
          title:
            "Cleaning and sanitizing of affected surfaces and materials",
          description:
            "Our sanitizers disinfect floors, walls, and belongings to ensure safety.",
        },
        {
          title: "Odor control and deodorization",
          description:
            "We use odor counteractants and ozone treatments to eliminate musty smells.",
        },
        {
          title: "Content cleaning, drying, and restoration",
          description:
            "Carpets, upholstery, and personal items are cleaned and dried by experts.",
        },
        {
          title: "Structural drying of walls, floors, and cavities",
          description:
            "We inject air and use probes to remove moisture from hard-to-reach cavities.",
        },
        {
          title: "Documentation of drying process for insurance purposes",
          description:
            "Detailed logs and photos support your insurance claim with clear evidence.",
        },
        {
          title: "Mold prevention strategies and treatments",
          description:
            "We advise on permanent fixes—ventilation, sealants—to keep mold at bay.",
        },
      ],
      process: [
        "Emergency Assessment and Water Extraction",
        "Comprehensive Drying Plan Development",
        "Professional Drying, Cleaning, and Sanitizing",
        "Final Moisture Verification and Inspection",
      ],
      benefits: [
        {
          title: "Rapid Water Removal and Drying",
          description:
            "Quick extraction and industrial drying to minimize damage and prevent secondary issues like mold.",
          icon: Droplets,
        },
        {
          title: "Mold Prevention",
          description:
            "Thorough drying and antimicrobial treatments to prevent mold growth and related health hazards.",
          icon: Shield,
        },
        {
          title: "Comprehensive Restoration",
          description:
            "Complete service from water extraction through cleaning, sanitizing, and restoring affected areas.",
          icon: Award,
        },
        {
          title: "Scientific Drying Process",
          description:
            "Moisture mapping and monitoring to ensure complete drying of all affected materials and spaces.",
          icon: Users,
        },
      ],
      faqs: [
        {
          question: "How quickly do you respond to water damage emergencies?",
          answer:
            "We offer 24/7 emergency response for water damage situations. Our teams typically arrive within 1–2 hours of your call, as rapid response is crucial to minimizing damage. The first 24–48 hours are critical in preventing secondary damage such as mold growth and structural deterioration.",
        },
        {
          question: "How long does the water damage drying process take?",
          answer:
            "The drying time depends on several factors, including the extent of water damage, the affected materials, and environmental conditions. Most residential water damage situations require 3–5 days for complete drying, though larger losses or special materials may take longer. We use moisture meters and thermal imaging to scientifically monitor the drying process and ensure all moisture is removed.",
        },
        {
          question: "Can you save wet carpet and padding?",
          answer:
            "In many cases, wet carpet can be saved if the water is clean or slightly contaminated and if extraction begins quickly. Carpet padding typically needs replacement after significant water exposure. For contaminated water (sewage, flooding), carpet and padding usually require replacement for health and safety reasons. We assess each situation individually and recommend the most appropriate and cost-effective approach.",
        },
        {
          question: "Do you work with insurance for water damage claims?",
          answer:
            "Yes, we regularly work with all major insurance companies and can assist with the claims process. We document the damage, take detailed moisture readings, photograph affected areas, and provide itemized drying and restoration costs. Our team can communicate directly with your insurance adjuster to streamline the process while ensuring you receive the coverage you're entitled to.",
        },
        {
          question: "How do you prevent mold after water damage?",
          answer:
            "We prevent mold through rapid water extraction, thorough drying using industrial dehumidifiers and air movers, moisture monitoring to ensure complete drying, and application of antimicrobial treatments where appropriate. Our comprehensive approach addresses both surface moisture and hidden moisture in wall cavities, under flooring, and other concealed spaces where mold commonly develops after water damage.",
        },
      ],
      testimonials: [
        {
          name: "Michael and Lisa Rodriguez",
          role: "Homeowners",
          rating: 5,
          comment:
            "After a major pipe burst flooded our home, their emergency response was incredible. They arrived quickly, extracted the water efficiently, and their drying process was thorough and well-explained. They saved our hardwood floors that we thought were ruined!",
        },
        {
          name: "James Wilson",
          role: "Office Manager",
          rating: 5,
          comment:
            "When our office suffered water damage from a sprinkler malfunction, their team minimized our downtime with their efficient response and drying process. They worked after hours to accommodate our business needs and prevented any mold issues.",
        },
        {
          name: "Patricia Thompson",
          role: "Property Owner",
          rating: 4,
          comment:
            "Their water damage team handled a complex situation in my rental property professionally and thoroughly. They coordinated well with insurance and kept me informed throughout the process. Their attention to preventing secondary damage was impressive.",
        },
      ],
    },
  },

  MOVE: {
    cleaning: {
      image: move,
      title: "Move-In/Move-Out Cleaning Services",
      shortDesc:
        "Comprehensive cleaning services for transitioning between properties, ensuring spaces are pristine for new occupants.",
      longDesc:
        "Our move-in/move-out cleaning services provide thorough, detailed cleaning for residential and commercial properties during transitions. Whether you're a homeowner, tenant, landlord, or property manager, our specialized cleaning ensures properties are immaculate for new occupants or ready for final inspection. We go beyond standard cleaning to address areas that show wear from occupancy, removing all traces of previous tenants and creating a fresh, welcoming environment. Our comprehensive approach covers every surface and area, from baseboards to appliances, leaving the space in move-in ready condition.",
      features: [
        {
          title: "Deep cleaning of all rooms and spaces",
          description:
            "We scrub, dust, and sanitize every room so it’s ready for final inspection or new occupants.",
        },
        {
          title: "Thorough kitchen cleaning, including appliances inside and out",
          description:
            "Ovens, fridges, cabinets—inside and out—are cleaned to remove grease and food residues.",
        },
        {
          title: "Comprehensive bathroom sanitization and descaling",
          description:
            "We remove mineral deposits and disinfect tubs, showers, and fixtures.",
        },
        {
          title: "Detailed cleaning of baseboards, door frames, and trim",
          description:
            "Every edge and corner is washed and wiped to eliminate scuff marks and dust.",
        },
        {
          title: "Window cleaning, including tracks and sills",
          description:
            "Windows are wiped, and tracks are cleared of debris for smooth operation.",
        },
        {
          title: "Cleaning inside cabinets, drawers, and closets",
          description:
            "We empty, wipe, and sanitize storage spaces so they’re ready for use.",
        },
        {
          title: "Removal of nails, hooks, and mounting hardware if requested",
          description:
            "We can patch and paint small holes to leave walls in showroom condition.",
        },
        {
          title: "Floor cleaning appropriate to surface type (vacuum, mop, polish)",
          description:
            "We choose the correct technique—shampoo, mop, or polish—to protect each flooring material.",
        },
        {
          title: "Dust removal from ceiling fans, light fixtures, and vents",
          description:
            "High-reach tools clear hidden dust and allergens from overhead surfaces.",
        },
        {
          title: "Spot cleaning of walls and attention to scuff marks",
          description:
            "We gently remove fingerprints, stains, and scuffs without harming paint finishes.",
        },
      ],
      process: [
        "Initial Property Assessment and Planning",
        "Customized Move-In/Out Cleaning Plan Development",
        "Detailed Cleaning Execution",
        "Final Inspection and Quality Verification",
      ],
      benefits: [
        {
          title: "Security Deposit Maximization",
          description:
            "Increase the likelihood of receiving your full security deposit back with thorough cleaning that meets landlord expectations.",
          icon: Home,
        },
        {
          title: "Stress Reduction During Transitions",
          description:
            "Eliminate the burden of cleaning during the already stressful process of moving to a new location.",
          icon: Shield,
        },
        {
          title: "Move-In Ready Condition",
          description:
            "Ensure your new space is thoroughly cleaned and sanitized before unpacking and settling in.",
          icon: Award,
        },
        {
          title: "Professional Property Presentation",
          description:
            "Present rental or sale properties in the best possible condition to attract quality tenants or buyers.",
          icon: Users,
        },
      ],
      faqs: [
        {
          question: "When should I schedule move-out cleaning?",
          answer:
            "Ideally, schedule move-out cleaning after all your belongings have been removed from the property but before your final walk-through with the landlord or property manager. This is typically 1–2 days before you hand over the keys. For move-in cleaning, schedule the service 1–2 days before you plan to move your belongings into the new space.",
        },
        {
          question: "How long does move-in/move-out cleaning take?",
          answer:
            "The duration depends on the size of the property and its condition. On average, a thorough move-in/move-out cleaning for a standard apartment takes 3–5 hours, while larger homes may take 5–8 hours or more. Properties that require extra attention due to heavy soiling or long-term occupancy may take longer.",
        },
        {
          question: "Do I need to be present during the cleaning?",
          answer:
            "You don't need to be present during the entire cleaning process, though you'll need to provide access to the property and be available for a final walk-through if desired. Many clients provide keys or access codes and arrange for a final inspection after the cleaning is complete.",
        },
        {
          question: "What's the difference between regular cleaning and move-in/move-out cleaning?",
          answer:
            "Move-in/move-out cleaning is much more comprehensive than regular cleaning. It includes areas not typically addressed in routine cleaning, such as inside appliances, cabinet interiors, baseboards, window tracks, and behind appliances. It focuses on deep cleaning every surface and fixture to prepare the space for new occupants or inspection.",
        },
        {
          question: "Can you handle cleaning for commercial property transitions?",
          answer:
            "Yes, we provide move-in/move-out cleaning for commercial properties of all types, including offices, retail spaces, restaurants, and industrial facilities. Our commercial transition cleaning follows the same thorough approach as our residential services but is tailored to the specific requirements of commercial spaces and lease agreements.",
        },
      ],
      testimonials: [
        {
          name: "Emma Johnson",
          role: "Tenant",
          rating: 5,
          comment:
            "Their move-out cleaning service saved my security deposit! The property manager was impressed with how clean everything was, and I received my full deposit back. Worth every penny for the stress relief alone.",
        },
        {
          name: "Daniel Garcia",
          role: "Property Manager",
          rating: 5,
          comment:
            "We use their move-in/move-out cleaning services for all our rental properties. Their consistent quality and attention to detail make property transitions smooth and help us maintain high standards for our tenants.",
        },
        {
          name: "Sophia Williams",
          role: "Homeowner",
          rating: 4,
          comment:
            "After purchasing our new home, we hired them for move-in cleaning. It was wonderful to start fresh in a thoroughly cleaned space. They addressed areas the previous owners had neglected for years.",
        },
      ],
    },
  },

  DECEASED: {
    cleaning: {
      image: deceased,
      title: "Deceased Estate Cleaning Services",
      shortDesc:
        "Compassionate, discreet cleaning services for properties following the passing of a loved one.",
      longDesc:
        "Our deceased estate cleaning services provide compassionate, respectful, and thorough cleaning for properties following the passing of a loved one. We understand this is an emotionally challenging time, and our experienced team approaches each situation with sensitivity and discretion. We handle the difficult task of cleaning, sanitizing, and preparing the property while you focus on more important matters. Our comprehensive service includes proper handling of personal belongings, thorough sanitization, odor removal, and preparation of the property for family, sale, or rental.",
      features: [
        {
          title: "Compassionate, discreet service during a difficult time",
          description:
            "Our team arrives in unmarked vehicles and plain clothing to respect your privacy.",
        },
        {
          title: "Proper handling and organization of personal belongings",
          description:
            "We work with executors to inventory, preserve, donate, or discard items as directed.",
        },
        {
          title: "Thorough cleaning and sanitization of all areas",
          description:
            "We apply hospital-grade disinfectants to ensure a safe and sanitary environment.",
        },
        {
          title: "Specialized cleaning for biohazard situations if needed",
          description:
            "Certified technicians use PPE and protocols to handle biological hazards safely.",
        },
        {
          title: "Odor removal and air purification",
          description:
            "Ozone and HEPA filtration treatments eliminate lingering odors effectively.",
        },
        {
          title: "Removal and disposal of unwanted items and waste",
          description:
            "We coordinate removal, recycling, and donation of unwanted goods per your wishes.",
        },
        {
          title: "Cleaning of neglected or long-unattended areas",
          description:
            "Our team tackles years of dust, mold, or pest residue in storage and attics.",
        },
        {
          title: "Preparation of property for family, sale, or rental",
          description:
            "We leave spaces move-in ready or staged for an optimal viewing experience.",
        },
        {
          title:
            "Coordination with estate executors or family representatives",
          description:
            "We communicate progress and get sign-off at each stage to ensure peace of mind.",
        },
        {
          title: "Flexible scheduling to accommodate family needs and timelines",
          description:
            "Services can begin within 24-48 hours, with options for expedited responses.",
        },
      ],
      process: [
        "Compassionate Consultation and Assessment",
        "Customized Estate Cleaning Plan Development",
        "Respectful Cleaning and Property Preparation",
        "Final Inspection and Verification",
      ],
      benefits: [
        {
          title: "Compassionate Support During Difficult Times",
          description:
            "Receive professional assistance with the challenging task of cleaning a loved one's property.",
          icon: Shield,
        },
        {
          title: "Thorough Sanitization and Odor Removal",
          description:
            "Ensure the property is properly cleaned, sanitized, and free from odors for family or future occupants.",
          icon: Wind,
        },
        {
          title: "Preservation of Valuable or Sentimental Items",
          description:
            "Careful handling and organization of personal belongings that may have sentimental or financial value.",
          icon: Award,
        },
        {
          title: "Property Preparation for Next Steps",
          description:
            "Prepare the property for family use, sale, or rental with thorough cleaning and organization.",
          icon: Skull,
        },
      ],
      faqs: [
        {
          question: "How do you handle personal belongings during deceased estate cleaning?",
          answer:
            "We treat all personal belongings with the utmost respect and care. Before cleaning begins, we work with family members or estate executors to identify items to be preserved, donated, or discarded. Items of potential value or sentimental importance are carefully set aside for family review. We can organize belongings, create inventories if requested, and ensure nothing of value is inadvertently discarded.",
        },
        {
          question: "Can you handle situations where the property has been unattended for some time?",
          answer:
            "Yes, we specialize in cleaning properties that have been unattended for extended periods. These situations often require special attention to issues such as dust accumulation, pest infestations, mold growth, or deterioration. Our team is equipped to address these challenges with appropriate cleaning techniques, equipment, and products to restore the property to a clean, habitable condition.",
        },
        {
          question: "Do you provide biohazard cleaning if necessary?",
          answer:
            "Yes, if the situation involves biohazards, we have specially trained technicians and appropriate equipment to safely clean and sanitize the area. This includes proper handling, disposal, and documentation in accordance with health regulations. Our biohazard cleaning follows strict protocols to ensure the property is safe for future occupancy.",
        },
        {
          question: "How quickly can you begin deceased estate cleaning services?",
          answer:
            "We understand the time-sensitive nature of these situations and can typically begin services within 24–48 hours of your request. We offer flexible scheduling to accommodate family needs, legal requirements, or property timelines. For urgent situations, we can often provide expedited service.",
        },
        {
          question: "How do you ensure privacy and discretion during the cleaning process?",
          answer:
            "We prioritize privacy and discretion in all aspects of our service. Our team arrives in unmarked vehicles, wears plain clothing rather than branded uniforms if requested, and conducts the cleaning with minimal visibility to neighbors or onlookers. We maintain strict confidentiality regarding all aspects of the property and personal belongings.",
        },
      ],
      testimonials: [
        {
          name: "Richard Thompson",
          role: "Family Member",
          rating: 5,
          comment:
            "During an incredibly difficult time after losing my father, their team handled the cleaning of his home with remarkable compassion and respect. They were thorough, discreet, and made a challenging task much easier for our family.",
        },
        {
          name: "Elizabeth Chen",
          role: "Estate Executor",
          rating: 5,
          comment:
            "As the executor of my aunt's estate, I was overwhelmed by the cleaning needed after her passing. Their service was professional, thorough, and handled with great sensitivity. They transformed a cluttered, neglected property into a clean, presentable home for sale.",
        },
        {
          name: "Michael Davis",
          role: "Attorney",
          rating: 4,
          comment:
            "I've recommended their deceased estate cleaning services to several clients, and the feedback has always been positive. They provide a valuable service during a difficult time, with professionalism and attention to detail.",
        },
      ],
    },
  },

  EXPLOSIVE: {
    cleaning: {
      image: explosive,
      title: "Explosive Residue Cleaning Services",
      shortDesc:
        "Specialized cleaning and decontamination services for areas affected by explosive residues and related hazardous materials.",
      longDesc:
        "Our explosive residue cleaning services provide expert decontamination for areas affected by explosive materials, gunshot residue, and related contaminants. Our highly trained technicians use specialized equipment, protective gear, and industry-approved techniques to safely remove hazardous residues and restore affected areas. We strictly adhere to safety protocols and regulatory guidelines while providing thorough cleaning that addresses visible contamination and microscopic particles that may pose health or safety risks.",
      features: [
        {
          title: "Specialized technicians trained in explosive residue handling",
          description:
            "Our experts follow military and police-grade protocols for safe residue removal.",
        },
        {
          title: "Comprehensive assessment and contamination mapping",
          description:
            "We use chemical detectors and lab analysis to identify all contaminate hotspots.",
        },
        {
          title: "Proper containment and isolation of affected areas",
          description:
            "Negative pressure systems and barriers prevent spread of fine particles.",
        },
        {
          title: "Safe removal of visible and microscopic residues",
          description:
            "ULPA vacuums and wipes capture both large debris and sub-micron particles.",
        },
        {
          title: "Specialized cleaning agents for specific contaminants",
          description:
            "Customized solvents break down explosive byproducts without harming surfaces.",
        },
        {
          title: "Advanced personal protective equipment (PPE) for technician safety",
          description:
            "Full encapsulation suits, respirators, and gloves ensure zero exposure.",
        },
        {
          title: "Decontamination of affected surfaces and materials",
          description:
            "Floors, walls, and furniture receive multi-step washing and neutralization.",
        },
        {
          title: "Air quality testing and particle monitoring",
          description:
            "Real-time air sampling confirms safety before re-entry is permitted.",
        },
        {
          title: "Proper documentation for compliance and insurance purposes",
          description:
            "We provide detailed reports and photographs for legal and insurance needs.",
        },
        {
          title: "Post-remediation verification testing",
          description:
            "Laboratory-grade surface and air tests validate complete decontamination.",
        },
      ],
      process: [
        "Safety Assessment and Contamination Evaluation",
        "Containment and Decontamination Strategy Development",
        "Specialized Residue Removal and Cleaning",
        "Testing and Verification of Complete Decontamination",
      ],
      benefits: [
        {
          title: "Expert Handling of Hazardous Residues",
          description:
            "Professional removal of potentially dangerous materials by technicians trained in explosive residue remediation.",
          icon: Bomb,
        },
        {
          title: "Comprehensive Decontamination",
          description:
            "Complete removal of visible and microscopic particles to ensure safety and eliminate health risks.",
          icon: Shield,
        },
        {
          title: "Regulatory Compliance",
          description:
            "Adherence to all applicable regulations and guidelines for handling and disposal of hazardous materials.",
          icon: Award,
        },
        {
          title: "Documentation and Certification",
          description:
            "Proper documentation of the remediation process for insurance, legal, or regulatory requirements.",
          icon: Users,
        },
      ],
      faqs: [
        {
          question: "What types of explosive residue can you clean?",
          answer:
            "Our technicians are trained to handle various types of explosive residues, including gunshot residue (GSR), residues from fireworks and pyrotechnics, explosive manufacturing residues, residues from industrial explosives, and contamination from improvised explosive devices. Each type requires specific handling protocols, which our team is thoroughly trained to implement.",
        },
        {
          question: "Why is professional cleaning necessary for explosive residue?",
          answer:
            "Explosive residues often contain toxic chemicals and heavy metals that pose health risks through inhalation, ingestion, or skin contact. Additionally, some residues may remain reactive or combustible, creating safety hazards. Professional cleaning ensures complete removal of both visible and microscopic particles using specialized equipment and techniques that conventional cleaning cannot achieve.",
        },
        {
          question: "How do you ensure safety during explosive residue cleaning?",
         answer:
            "Safety is our highest priority. We implement strict safety protocols including proper containment of the affected area, use of appropriate personal protective equipment (PPE), specialized ventilation and air filtration, proper decontamination procedures, and continuous monitoring. Our technicians follow established industry guidelines and regulatory requirements for handling potentially hazardous materials.",
        },
        {
          question: "What testing methods do you use to verify complete decontamination?",
         answer:
            "We employ several testing methods depending on the specific contaminants involved. These may include surface wipe sampling analyzed by laboratory testing, specialized detection equipment for specific compounds, air quality testing for particulates, and visual inspection under specialized lighting. We provide detailed documentation of all testing results to verify complete decontamination.",
        },
        {
          question: "How quickly can you respond to explosive residue cleaning needs?",
         answer:
            "We understand the urgent nature of these situations and offer rapid response services. In most cases, we can begin the assessment process within 24 hours of your call. The timeline for complete remediation depends on the extent of contamination and the specific materials involved, but we work efficiently while maintaining thorough safety protocols.",
        },
      ],
      testimonials: [
        {
          name: "Captain James Wilson",
          role: "Law Enforcement Officer",
          rating: 5,
          comment:
            "Their team provided exceptional cleaning services following an incident at our training facility. Their knowledge of explosive residue handling protocols was impressive, and they ensured the facility was completely safe for continued use.",
        },
        {
          name: "Dr. Sarah Martinez",
          role: "Laboratory Director",
          rating: 5,
          comment:
            "After contamination in our research facility, their explosive residue cleaning team responded quickly and professionally. Their methodical approach to containment and cleanup was impressive, and their documentation was thorough for our compliance requirements.",
        },
        {
          name: "Thomas Reynolds",
          role: "Property Manager",
          rating: 4,
          comment:
            "When we discovered residue contamination during a property renovation, their team provided expert guidance and remediation. They handled a complex situation efficiently and ensured the property was safe for continued work.",
        },
      ],
    },
  },

  MOLD: {
    cleaning: {
      image: mold,
      title: "Mold Remediation Services",
      shortDesc:
        "Professional mold removal and remediation services to eliminate mold growth and prevent future infestations.",
      longDesc:
        "Our mold remediation services provide comprehensive solutions for identifying, containing, and eliminating mold problems in residential and commercial properties. We understand the health risks and structural damage associated with mold infestations and employ industry-approved techniques to safely remove mold and prevent its return. Our certified technicians use specialized equipment, containment procedures, and antimicrobial treatments to address both visible mold and hidden growth within building materials and structures.",
      features: [
        {
          title: "Comprehensive mold inspection and assessment",
          description:
            "We identify visible mold and use moisture mapping to locate hidden infestations.",
        },
        {
          title: "Advanced moisture detection to identify the source",
          description:
            "Thermal imaging and hygrometers pinpoint water intrusion points causing mold growth.",
        },
        {
          title: "Proper containment to prevent cross-contamination",
          description:
            "We install plastic barriers, negative air machines, and HEPA filtration to isolate the work area.",
        },
        {
          title: "Safe removal of mold-affected materials",
          description:
            "Contaminated drywall, insulation, and flooring are carefully removed and disposed.",
        },
        {
          title: "HEPA air filtration during remediation",
          description:
            "Portable HEPA units capture 99.97% of mold spores in the air, preserving clean areas.",
        },
        {
          title: "Antimicrobial treatments to prevent regrowth",
          description:
            "EPA-registered biocides are applied to inhibit future mold spore development.",
        },
        {
          title: "Structural drying and dehumidification",
          description:
            "Industrial-strength dehumidifiers and air movers dry out structural cavities and surfaces.",
        },
        {
          title: "Post-remediation verification testing",
          description:
            "Surface and air samples confirm mold levels meet safety standards before reoccupation.",
        },
        {
          title: "Preventative recommendations to avoid future issues",
          description:
            "We advise on proper ventilation, repairs, and maintenance to keep mold at bay.",
        },
        {
          title: "Documentation for insurance and disclosure purposes",
          description:
            "Detailed reports, photos, and lab results support claims and real estate transactions.",
        },
      ],
      process: [
        "Thorough Inspection and Mold Assessment",
        "Customized Remediation Plan Development",
        "Professional Mold Removal and Prevention",
        "Post-Remediation Verification and Documentation",
      ],
      benefits: [
        {
          title: "Health Protection",
          description:
            "Eliminate mold that can cause allergic reactions, respiratory issues, and other health problems.",
          icon: Shield,
        },
        {
          title: "Structural Preservation",
          description:
            "Prevent damage to building materials and structural components caused by ongoing mold growth.",
          icon: Building,
        },
        {
          title: "Complete Mold Elimination",
          description:
            "Address both visible mold and hidden growth within walls, under floors, and in other concealed areas.",
          icon: Award,
        },
        {
          title: "Long-term Prevention",
          description:
            "Identify and address moisture sources to prevent future mold problems and protect your property.",
          icon: Users,
        },
      ],
      faqs: [
        {
          question: "How do you identify if I have a mold problem?",
          answer:
            "We conduct a comprehensive mold inspection that includes visual assessment, moisture mapping, and when necessary, sampling for laboratory analysis. We look for visible mold growth, signs of water damage, moisture intrusion, and use specialized equipment to detect hidden moisture in building materials. In some cases, we may recommend air quality testing or surface sampling to identify mold types and concentration levels.",
        },
        {
          question: "Is it necessary to test for mold if I can already see it?",
          answer:
            "If visible mold is present, remediation is typically necessary regardless of the type. However, testing can be valuable for determining the extent of the problem, identifying hidden mold, verifying successful remediation, or addressing health concerns related to specific mold types. We can help you determine if testing is beneficial in your specific situation.",
        },
        {
          question: "How do you prevent cross-contamination during mold remediation?",
          answer:
            "We implement strict containment procedures including physical barriers with plastic sheeting, negative air pressure systems, HEPA air filtration, decontamination chambers for workers and equipment, and proper handling and disposal of mold-contaminated materials. These measures prevent mold spores from spreading to unaffected areas of your property during the remediation process.",
        },
        {
          question: "Can you remove mold permanently?",
          answer:
            "We can completely remove existing mold growth, but preventing future mold requires addressing the underlying moisture issues. As part of our service, we identify moisture sources and provide recommendations for addressing them. When moisture problems are properly corrected, and our preventative recommendations are followed, the likelihood of mold returning is significantly reduced.",
        },
        {
          question: "How long does mold remediation take?",
          answer:
            "The duration depends on the extent of mold growth, the affected materials, and the size of the contaminated area. Small remediation projects might be completed in 1–2 days, while larger or more complex situations could take several days to a week or more. We provide a timeline estimate after our initial assessment and keep you informed of progress throughout the project.",
        },
      ],
      testimonials: [
        {
          name: "Rebecca Anderson",
          role: "Homeowner",
          rating: 5,
          comment:
            "After discovering mold in our basement, their team provided thorough remediation services. They identified the source of moisture, removed all the mold, and gave us valuable advice to prevent future problems. Our air quality has noticeably improved!",
        },
        {
          name: "David Chen",
          role: "Commercial Property Manager",
          rating: 5,
          comment:
            "Their mold remediation team handled a complex situation in our office building professionally and efficiently. They worked after hours to minimize disruption to our business and provided detailed documentation for our insurance claim.",
        },
        {
          name: "Jennifer Martinez",
          role: "Rental Property Owner",
          rating: 4,
          comment:
            "When mold was discovered in one of my rental properties, their team responded quickly and thoroughly. They not only remediated the existing mold but helped identify and fix the underlying plumbing issue that caused it. Very satisfied with their comprehensive approach.",
        },
      ],
    },
  },

  CONSTRUCTION: {
    cleaning: {
      image: construction,
      title: "Post-Construction Cleaning Services",
      shortDesc:
        "Comprehensive cleaning services for newly constructed or renovated properties, removing construction debris and preparing spaces for occupancy.",
      longDesc:
        "Our post-construction cleaning services provide thorough cleaning for properties following construction, renovation, or remodeling projects. We understand the unique challenges of construction cleanup, including fine dust, debris, material residues, and protective coverings that require specialized cleaning approaches. Our professional team transforms construction zones into clean, move-in ready spaces by addressing every surface and area affected by construction activities. We work with homeowners, contractors, builders, and property managers to ensure properties meet the highest standards of cleanliness before occupancy.",
      features: [
        {
          title: "Removal of construction dust from all surfaces and fixtures",
          description:
            "HEPA-filtered vacuums and microfiber cloths capture fine dust without redistributing it.",
        },
        {
          title: "Cleaning of air vents, ducts, and HVAC components",
          description:
            "We dismantle and wash vents to eliminate settled debris and improve airflow.",
        },
        {
          title: "Removal of adhesive residues, stickers, and protective films",
          description:
            "Safe solvents and gentle scrapers remove films and glues without damaging surfaces.",
        },
        {
          title: "Detailed cleaning of windows, frames, and tracks",
          description:
            "We flush and scrub tracks and frames to ensure windows slide freely and look pristine.",
        },
        {
          title: "Thorough cleaning of all cabinetry, inside and out",
          description:
            "Cabinet interiors and exteriors are wiped down to remove plaster dust and fingerprints.",
        },
        {
          title: "Sanitization of all bathroom fixtures and surfaces",
          description:
            "Our disinfectants eliminate construction-related grime from toilets, sinks, and tubs.",
        },
        {
          title: "Cleaning of light fixtures, switches, and outlets",
          description:
            "We dust and wipe each electrical component safely after shutting off power when needed.",
        },
        {
          title: "Floor cleaning appropriate to surface type (vacuum, mop, polish)",
          description:
            "We match technique and product to tile, hardwood, carpet, or stone for best results.",
        },
        {
          title: "Removal of construction debris and packaging materials",
          description:
            "All leftover packaging, nails, and scrap materials are collected and hauled away.",
        },
        {
          title: "Final detailing to prepare for occupancy or inspection",
          description:
            "We conduct a walkthrough checklist to address any missed spots before handover.",
        },
      ],
      process: [
        "Construction Site Assessment and Planning",
        "Comprehensive Cleaning Strategy Development",
        "Detailed Post-Construction Cleaning Execution",
        "Final Inspection and Quality Verification",
      ],
      benefits: [
        {
          title: "Construction Dust Elimination",
          description:
            "Remove pervasive construction dust that can affect air quality and settle on all surfaces.",
          icon: Building,
        },
        {
          title: "Move-In Ready Preparation",
          description:
            "Transform a construction zone into a clean, habitable space ready for immediate occupancy.",
          icon: Home,
        },
        {
          title: "Protection of New Fixtures and Finishes",
          description:
            "Proper cleaning techniques that protect newly installed fixtures, surfaces, and finishes.",
          icon: Shield,
        },
        {
          title: "Comprehensive Cleaning Solution",
          description:
            "Address all aspects of construction cleanup, from rough cleaning to final detailing.",
          icon: Award,
        },
      ],
      faqs: [
        {
          question: "When should post-construction cleaning be scheduled?",
          answer:
            "Post-construction cleaning should be scheduled after all construction work is completed but before furniture placement and occupancy. Ideally, the cleaning takes place after contractors have removed their equipment and major debris, but before final inspections or move-in. For larger projects, we can provide phased cleaning services at different stages of construction completion.",
        },
        {
          question: "How do you handle construction dust that seems to be everywhere?",
          answer:
            "Construction dust requires a systematic approach, working from top to bottom. We begin with air duct cleaning if needed, then address ceiling fixtures, walls, and finally floors. We use HEPA-filtered vacuums, microfiber cleaning materials, and specialized equipment to capture fine dust rather than redistributing it. Multiple cleaning passes are often necessary to completely eliminate construction dust.",
        },
        {
          question: "Can you remove paint overspray, adhesive residues, and other construction materials?",
          answer:
            "Yes, we use appropriate solvents and techniques to safely remove paint overspray, adhesive residues, silicone caulk, grout haze, and other construction materials without damaging the underlying surfaces. Our technicians are trained in identifying surface types and selecting the appropriate cleaning methods and products for each situation.",
        },
        {
          question: "Do you clean inside cabinets, drawers, and closets?",
          answer:
            "Yes, our post-construction cleaning includes thorough cleaning of all cabinet interiors, drawers, closets, and storage spaces. Construction dust often accumulates in these areas, and they need to be properly cleaned before items are stored inside. We remove any debris, dust, and packaging materials, and wipe down all interior surfaces.",
        },
        {
          question: "How long does post-construction cleaning take?",
          answer:
            "The duration depends on the size of the property and the extent of the construction work. For a standard residential renovation, post-construction cleaning typically takes 1–2 days. Larger properties or new construction projects may require 3–5 days or more. We can provide a more accurate timeline after assessing the specific requirements of your project.",
        },
      ],
      testimonials: [
        {
          name: "Robert Johnson",
          role: "Homeowner",
          rating: 5,
          comment:
            "After a major home renovation, their post-construction cleaning team transformed our dust-covered house into a spotless home. They removed all traces of construction, even in areas we didn't think to check. Exceptional attention to detail!",
        },
        {
          name: "Maria Garcia",
          role: "General Contractor",
          rating: 5,
          comment:
            "We regularly partner with this company for post-construction cleaning on our projects. Their thorough work makes our final walk-throughs with clients go smoothly, and they're flexible with our sometimes unpredictable construction timelines.",
        },
        {
          name: "Thomas Wilson",
          role: "Property Developer",
          rating: 4,
          comment:
            "Their post-construction cleaning services are a crucial final step in our development projects. They understand the unique challenges of new construction cleaning and consistently deliver properties that are truly move-in ready for our buyers.",
        },
      ],
    },
  },

  COMMERCIAL: {
    cleaning: {
      image: commercial,
      title: "Commercial Cleaning Services",
      shortDesc:
        "Professional cleaning solutions for businesses of all sizes, ensuring a clean, healthy, and productive work environment.",
      longDesc:
        "Our commercial cleaning services provide comprehensive solutions for maintaining clean, hygienic, and professional business environments. We understand that a clean workplace not only creates a positive impression on clients and visitors but also contributes to employee health, productivity, and morale. Our professional team delivers exceptional results using industry-leading techniques, eco-friendly products, and advanced equipment tailored to your specific business needs and schedule.",
      features: [
        {
          title: "Customized cleaning plans tailored to your business's specific needs",
          description:
            "We assess your facility and traffic patterns to design a plan that targets your highest-priority areas.",
        },
        {
          title:
            "Comprehensive cleaning of all areas, including offices, conference rooms, lobbies, and restrooms",
          description:
            "From reception desks to restrooms, every space is sanitized and refreshed on schedule.",
        },
        {
          title: "Special attention to high-traffic areas and frequently touched surfaces",
          description:
            "Door handles, elevator buttons, and handrails receive extra disinfection to reduce germ spread.",
        },
        {
          title:
            "Eco-friendly cleaning products that are safe for employees and visitors",
          description:
            "We choose low-odor, non-toxic solutions to maintain air quality and comfort.",
        },
        {
          title: "Flexible scheduling options, including daily, weekly, or monthly services",
          description:
            "Services can be performed during off-hours, weekends, or between shifts to minimize disruption.",
        },
        {
          title: "Detailed cleaning of fixtures, equipment, and hard-to-reach areas",
          description:
            "We use extension tools and specialized attachments to clean vents, light fixtures, and behind equipment.",
        },
        {
          title: "Floor care for all types of surfaces, including carpet, tile, hardwood, and vinyl",
          description:
            "We apply the right techniques—steam, bonnet, or buffing—to maintain appearance and longevity.",
        },
        {
          title: "Window and glass cleaning for a professional appearance",
          description:
            "Streak-free methods and squeegees leave large windows and glass partitions gleaming.",
        },
        {
          title: "Dust removal from all surfaces, including desks, shelves, and equipment",
          description:
            "Electrostatic dusters capture particles without scattering them into the air.",
        },
        {
          title: "Restroom sanitization and disinfection for optimal hygiene",
          description:
            "We deep-clean toilets, sinks, and partitions with commercial-grade disinfectants.",
        },
      ],
      process: [
        "Initial Site Assessment and Consultation",
        "Customized Commercial Cleaning Plan Development",
        "Professional Cleaning Execution",
        "Quality Inspection and Client Feedback",
      ],
      benefits: [
        {
          title: "Enhanced Professional Image",
          description:
            "Create a positive impression on clients, visitors, and employees with a consistently clean and well-maintained facility.",
          icon: Briefcase,
        },
        {
          title: "Healthier Work Environment",
          description:
            "Reduce allergens, bacteria, and contaminants for improved indoor air quality and employee health.",
          icon: Shield,
        },
        {
          title: "Increased Productivity",
          description:
            "A clean, organized workspace helps employees focus and perform at their best, boosting overall productivity.",
          icon: Clock,
        },
        {
          title: "Customized Cleaning Solutions",
          description:
            "Receive personalized service that addresses your specific business cleaning needs and schedule.",
          icon: Users,
        },
      ],
      faqs: [
        {
          question: "How do you handle cleaning during business hours?",
          answer:
            "We understand the importance of minimizing disruption to your business operations. We can schedule cleaning services during off-hours, weekends, or after business hours to ensure minimal interference with your daily activities. If cleaning during business hours is necessary, our team works discreetly and efficiently to minimize any disruption.",
        },
        {
          question: "Can you accommodate special cleaning requirements for our industry?",
          answer:
            "Yes, we specialize in customized cleaning solutions for various industries, including healthcare, hospitality, retail, and office environments. We understand that different businesses have unique cleaning requirements, and we tailor our services to meet industry-specific standards and regulations.",
        },
        {
          question: "Do you provide cleaning supplies and equipment?",
          answer:
            "Yes, our professional team brings all necessary cleaning supplies, equipment, and products. We use commercial-grade, eco-friendly cleaning solutions that are effective yet safe for your employees and visitors. If you have specific products you prefer, we're happy to accommodate your preferences.",
        },
        {
          question: "How do you ensure consistent quality across all cleaning services?",
          answer:
            "We implement a comprehensive quality control system that includes regular inspections, supervisor oversight, detailed cleaning checklists, and client feedback mechanisms. Our cleaning technicians undergo thorough training to ensure they deliver consistent, high-quality service that meets our exacting standards.",
        },
        {
          question: "What if we need to adjust our cleaning schedule or services?",
          answer:
            "We understand that business needs can change. We offer flexible scheduling and service adjustments to accommodate your evolving requirements. Simply contact your dedicated account manager to discuss any changes to your cleaning schedule or service scope.",
        },
      ],
      testimonials: [
        {
          name: "Robert Anderson",
          role: "Office Manager",
          rating: 5,
          comment:
            "Their commercial cleaning service has transformed our office environment. The team is professional, thorough, and reliable. Our employees have noticed the difference, and clients always comment on how clean our facilities are.",
        },
        {
          name: "Lisa Martinez",
          role: "Retail Store Owner",
          rating: 5,
          comment:
            "As a retail business, cleanliness is crucial for customer experience. This cleaning service consistently delivers exceptional results. Our store always looks immaculate, which has positively impacted our customer satisfaction and sales.",
        },
        {
          name: "David Wilson",
          role: "Medical Office Administrator",
          rating: 4,
          comment:
            "In the healthcare industry, cleanliness and sanitation are paramount. This cleaning service understands our specific requirements and consistently meets the high standards necessary for our medical facility. Highly recommended!",
        },
      ],
    },
  },
}


























const serviceInfoES = {
  REGULAR: {
    cleaning: {
      image: regular,
      title: "Servicios de Limpieza Regular",
      shortDesc:
        "Servicios de limpieza estándar para hogares y empresas, ofreciendo mantenimiento y limpieza constantes.",
      longDesc:
        "Nuestros servicios de limpieza regular brindan un mantenimiento confiable y constante para su hogar o negocio. Nos enfocamos en mantener sus espacios limpios, frescos y acogedores con limpieza rutinaria que abarca áreas comunes, superficies y accesorios. Nuestro equipo profesional sigue un enfoque sistemático para garantizar que ningún detalle se pase por alto, utilizando productos ecológicos y técnicas eficientes para ofrecer resultados excepcionales en un horario regular que funcione para usted.",
      features: [
        {
          title: "Limpieza sistemática de todas las áreas y superficies comunes",
          description:
            "Seguimos una lista de verificación detallada para asegurarnos de limpiar cada rincón y superficie de su espacio.",
        },
        {
          title: "Desempolvado y limpieza de muebles, accesorios y superficies accesibles",
          description:
            "Utilizamos paños de microfibra para eliminar polvo y manchas sin dañar los acabados delicados.",
        },
        {
          title: "Aspirado y fregado de pisos",
          description:
            "Seleccionamos métodos de aspirado y fregado adecuados para dejar impecables alfombras, baldosas y pisos de madera.",
        },
        {
          title: "Limpieza y desinfección de baños y cocinas",
          description:
            "Aplicamos desinfectantes de grado hospitalario para eliminar gérmenes, moho y residuos de jabón.",
        },
        {
          title: "Vaciado de basura y reemplazo de bolsas",
          description:
            "Retiramos desechos, desinfectamos contenedores y colocamos bolsas nuevas para prevenir malos olores.",
        },
        {
          title: "Limpieza puntual de puertas, marcos e interruptores",
          description:
            "Desinfectamos puntos de alto contacto para reducir la propagación de bacterias y virus.",
        },
        {
          title: "Limpieza de espejos y superficies de vidrio",
          description:
            "Usamos limpiavidrios y paños especiales para eliminar manchas y lograr un acabado sin rayas.",
        },
        {
          title: "Organización y orden de áreas comunes",
          description:
            "Alineamos cojines, doblamos mantas y ordenamos objetos para un espacio acogedor.",
        },
        {
          title: "Eliminación de telarañas y polvo superficial",
          description:
            "Utilizamos plumeros extensibles para alcanzar esquinas altas y remover telarañas acumuladas.",
        },
        {
          title: "Productos de limpieza ecológicos para un ambiente saludable",
          description:
            "Empleamos soluciones biodegradables y libres de químicos agresivos, seguras para familia y mascotas.",
        },
      ],
      process: [
        "Consulta y Evaluación Inicial",
        "Desarrollo de Plan de Limpieza Personalizado",
        "Ejecución Profesional de la Limpieza",
        "Inspección de Calidad y Retroalimentación del Cliente",
      ],
      benefits: [
        {
          title: "Limpieza Constante",
          description:
            "Mantenga un ambiente siempre limpio y acogedor con servicio profesional regular.",
          icon: Clock,
        },
        {
          title: "Espacios Saludables",
          description:
            "Reduzca alérgenos, polvo y contaminantes para mejorar la calidad del aire interior y la salud general.",
          icon: Shield,
        },
        {
          title: "Ahorro de Tiempo",
          description:
            "Libere su tiempo para actividades más importantes mientras nos encargamos de la limpieza rutinaria.",
          icon: Award,
        },
        {
          title: "Soluciones Personalizadas",
          description:
            "Reciba un servicio a medida que aborde sus necesidades y preferencias de limpieza específicas.",
          icon: Users,
        },
      ],
      faqs: [
        {
          question: "¿Con qué frecuencia debo programar la limpieza regular?",
          answer:
            "La frecuencia depende de sus necesidades y del nivel de tráfico en su espacio. Muchos clientes eligen servicio semanal, quincenal o mensual según conveniencia.",
        },
        {
          question: "¿Qué áreas incluye la limpieza regular?",
          answer:
            "Incluye áreas comunes, cocinas, baños, salas, dormitorios y oficinas. Desempolvamos, aspiramos, fregamos y desinfectamos cada espacio.",
        },
        {
          question: "¿Cuánto dura una limpieza regular?",
          answer:
            "En promedio, entre 2 y 4 horas para un hogar estándar o pequeña oficina; puede variar según el tamaño.",
        },
        {
          question: "¿Debo proporcionar suministros?",
          answer:
            "No, nuestro equipo trae todos los suministros y equipos necesarios, usando productos ecológicos y seguros.",
        },
        {
          question: "¿Puedo reprogramar mi cita?",
          answer:
            "Sí, avísenos con al menos 48 horas de antelación para reprogramar sin inconvenientes.",
        },
      ],
      testimonials: [
        {
          name: "Emily Johnson",
          role: "Propietaria",
          rating: 5,
          comment:
            "¡Su servicio de limpieza regular ha sido un cambio total! Nuestra casa siempre se siente fresca y acogedora después de su visita.",
        },
        {
          name: "Michael Thompson",
          role: "Dueño de Negocio",
          rating: 5,
          comment:
            "Llevamos más de un año y la calidad nunca falla. Nuestro espacio siempre está impecable.",
        },
        {
          name: "Jennifer Davis",
          role: "Profesional Ocupada",
          rating: 4,
          comment:
            "Con mi horario, su servicio ha sido invaluable. Son confiables y detallistas. ¡Muy recomendados!",
        },
      ],
    },
  },
  ENVIRONMENT: {
    cleaning: {
      image: enviroment,
      title: "Servicios de Limpieza Ecológica",
      shortDesc:
        "Soluciones de limpieza ecológicas que protegen su espacio y el planeta, usando prácticas y productos sostenibles.",
      longDesc:
        "Nuestros servicios combinan limpieza efectiva con responsabilidad ambiental. Utilizamos productos certificados verdes, prácticas sostenibles y equipos de bajo consumo energético para resultados excepcionales y seguros para su familia y el planeta.",
      features: [
        { title: "Productos certificados ecológicos y biodegradables", description: "Solo usamos productos con certificación Green Seal, EcoLogo y EPA Safer Choice." },
        { title: "Prácticas sostenibles", description: "Reducimos uso de agua y energía con métodos eficientes." },
        { title: "Microfibra de alta eficiencia", description: "Captura polvo y suciedad con mínima humedad." },
        { title: "Aspiradoras HEPA", description: "Filtran el 99.97% de partículas para aire más limpio." },
        { title: "Técnicas de ahorro de agua", description: "Usamos hasta 80% menos de agua en cada limpieza." },
        { title: "Envases concentrados", description: "Menos plástico y desperdicios en cada recarga." },
        { title: "Desinfección no tóxica", description: "Desinfectantes a base de plantas sin químicos agresivos." },
        { title: "Equipos energía eficiente", description: "Certificación Energy Star en cada máquina." },
        { title: "Reciclaje y disposición adecuada", description: "Separamos residuos según normativa ambiental local." },
        { title: "Mejora de calidad de aire", description: "Filtración y ventilación para reducir COV." },
      ],
      process: [
        "Evaluación y Consulta Ambiental",
        "Desarrollo de Plan Verde",
        "Ejecución Ecológica",
        "Evaluación de Impacto",
      ],
      benefits: [
        { title: "Espacios Saludables", description: "Elimine químicos tóxicos y mejore su aire interior.", icon: Wind },
        { title: "Menor Huella", description: "Minimize impacto ambiental con productos verdes.", icon: Shield },
        { title: "Seguro para Todos", description: "Protege niños, mascotas y personas sensibles.", icon: Users },
        { title: "Limpieza Sostenible", description: "Resultados excepcionales y eco-responsables.", icon: Award },
      ],
      faqs: [
        { question: "¿Es efectiva la limpieza ecológica?", answer: "Sí, igual de efectiva que la convencional y sin químicos tóxicos." },
        { question: "¿Qué certificaciones tienen los productos?", answer: "Green Seal, EcoLogo, EPA Safer Choice y USDA BioPreferred." },
        { question: "¿Cómo mejora el aire interior?", answer: "Eliminamos COV y filtramos alérgenos con HEPA." },
        { question: "¿Es más cara?", answer: "Competitiva; el ahorro en salud y recursos la compensa." },
        { question: "¿Ayuda con alergias?", answer: "Productos hipoalergénicos y técnicas especializadas." },
      ],
      testimonials: [
        { name: "Laura Peterson", role: "Madre con hijos alérgicos", rating: 5, comment: "Disminuyeron las alergias y nuestro hogar está libre de químicos." },
        { name: "Robert Chen", role: "Empresario sostenible", rating: 5, comment: "Resultados excepcionales y alineados con nuestros valores." },
        { name: "Sophia Martinez", role: "Profesional de salud", rating: 4, comment: "Soluciones no tóxicas que realmente funcionan." },
      ],
    },
  },
  DEEP: {
    cleaning: {
      image: deep,
      title: "Servicios de Limpieza Profunda",
      shortDesc:
        "Limpieza intensiva que va más allá de la superficie para eliminar suciedad y alérgenos acumulados.",
      longDesc:
        "Nuestros servicios de limpieza profunda abordan áreas difíciles de alcanzar y eliminan suciedad, bacterias y alérgenos con técnicas especializadas y agentes de limpieza de alta potencia.",
      features: [
        { title: "Limpieza integral de superficies y accesorios", description: "Limpiamos a fondo pisos, paredes, techos y muebles para eliminar toda suciedad." },
        { title: "Detallado de molduras y zócalos", description: "Removemos polvo y partículas acumuladas en molduras, cornisas y marcos." },
        { title: "Limpieza profunda de electrodomésticos", description: "Desmontamos y limpiamos hornos, neveras y microondas por dentro y fuera." },
        { title: "Desinfección de baños y azulejos", description: "Aplicamos técnicas para eliminar moho y incrustaciones en azulejos y juntas." },
        { title: "Limpieza detrás y debajo de muebles", description: "Movemos muebles cuando es posible para limpiar áreas ocultas.", },
        { title: "Desempolvado de ventiladores y lámparas", description: "Utilizamos herramientas especiales para quitar polvo de ventiladores y lámparas.", },
        { title: "Limpieza de ventanas y rieles", description: "Lavado de cristales y eliminación de suciedad en rieles y marcos." },
        { title: "Limpieza de alfombras y tapicería", description: "Extracción de manchas y rejuvenecimiento de telas con máquinas especiales." },
        { title: "Limpieza de armarios y cajones", description: "Vacía, limpia y organiza interiores de armarios y gabinetes." },
        { title: "Eliminación de depósitos minerales", description: "Tratamientos para quitar cal y sarro de grifos y azulejos." },
      ],
      process: [
        "Evaluación y Planificación Integral",
        "Desarrollo de Plan de Limpieza Detallado",
        "Ejecución Intensiva de Limpieza",
        "Inspección y Garantía de Calidad",
      ],
      benefits: [
        { title: "Eliminación de Contaminantes Ocultos", description: "Removemos polvo, alérgenos y bacterias de áreas olvidadas.", icon: Shield },
        { title: "Espacio Revitalizado", description: "Su entorno se sentirá, olerá y lucirá como nuevo.", icon: Wind },
        { title: "Mayor Durabilidad de Superficies", description: "Previene el desgaste por suciedad acumulada.", icon: Clock },
        { title: "Mejor Calidad de Aire", description: "Reduce alérgenos y polvos que afectan la respiración.", icon: Users },
      ],
      faqs: [
        { question: "¿Cada cuánto conviene la limpieza profunda?", answer: "Se recomienda 2-4 veces al año según tráfico y condiciones.", },
        { question: "¿Cuánto dura?", answer: "Generalmente de 5 a 10 horas o más, según el tamaño del espacio.", },
        { question: "¿En qué difiere de la limpieza regular?", answer: "Profundiza en áreas no cubiertas en la limpieza rutinaria.", },
        { question: "¿Debo preparar el espacio?", answer: "Recomendamos despejar objetos para facilitar el acceso.", },
        { question: "¿Elimina manchas difíciles?", answer: "Usamos productos y técnicas para tratar manchas y acumulaciones.", },
      ],
      testimonials: [
        { name: "Rebecca Wilson", role: "Propietaria", rating: 5, comment: "¡Increíble resultado! Áreas que no sabía estaban sucias quedaron impecables." },
        { name: "James Anderson", role: "Dueño de Restaurante", rating: 5, comment: "Nuestra cocina luce mejor que nunca tras su limpieza profunda." },
        { name: "Olivia Garcia", role: "Administradora de Propiedades", rating: 4, comment: "Ideal para preparar apartamentos para nuevos inquilinos." },
      ],
    },
  },
  HAZMAT: {
    cleaning: {
      image: hazmat,
      title: "Servicios de Limpieza de Materiales Peligrosos",
      shortDesc:
        "Limpieza y descontaminación experta en entornos con sustancias peligrosas.",
      longDesc:
        "Nuestro equipo certificado maneja derrames químicos, contaminantes biológicos y desechos industriales bajo protocolos OSHA y EPA para una descontaminación segura y completa.",
      features: [
        { title: "Técnicos certificados en HAZWOPER", description: "Especializados en manejo de residuos peligrosos y respuesta a emergencias.", },
        { title: "Evaluación integral de riesgos", description: "Identificamos y clasificamos contaminantes antes de intervenir.", },
        { title: "Contención y aislamiento", description: "Establecemos barreras para evitar propagación de materiales.", },
        { title: "Remoción y disposición segura", description: "Transportamos y eliminamos desechos según normativa.", },
        { title: "Agentes de neutralización especializados", description: "Seleccionamos químicos para cada tipo de contaminante.", },
        { title: "Equipos de protección personal avanzados", description: "Proporcionamos trajes y respiradores certificados.", },
        { title: "Descontaminación de superficies", description: "Limpiamos macroscópicamente y con micropartículas.", },
        { title: "Monitoreo de calidad del aire", description: "Medimos partículas y gases antes y después del trabajo.", },
        { title: "Documentación para cumplimiento", description: "Informes detallados para auditorías y seguros.", },
        { title: "Pruebas de verificación post-limpieza", description: "Ensayos de superficie y aire para asegurar descontaminación.", },
      ],
      process: [
        "Evaluación de Riesgos y Planificación",
        "Desarrollo de Estrategias de Contención",
        "Remoción y Descontaminación Segura",
        "Verificación y Documentación Final",
      ],
      benefits: [
        { title: "Gestión Experta de Riesgos", description: "Manejo profesional de sustancias peligrosas.", icon: Shield },
        { title: "Cumplimiento Normativo", description: "Adherencia a leyes OSHA, EPA y locales.", icon: Award },
        { title: "Descontaminación Completa", description: "Eliminación total de contaminantes.", icon: Users },
        { title: "Informes y Certificados", description: "Documentación detallada para sus registros.", icon: Briefcase },
      ],
      faqs: [
        { question: "¿Qué materiales manejan?", answer: "Químicos, biológicos, asbesto, metales pesados y otros.", },
        { question: "¿Cómo garantizan seguridad?", answer: "Protocolos estrictos de PPE y monitoreo continuo.", },
        { question: "¿Qué certificaciones tienen los técnicos?", answer: "HAZWOPER, OSHA y cursos específicos por contaminante.", },
        { question: "¿Cómo se dispone el residuo?", answer: "Transporte y eliminación en instalaciones autorizadas.", },
        { question: "¿Realizan pruebas post-limpieza?", answer: "Sí, wipe tests y mediciones de aire.", },
      ],
      testimonials: [
        { name: "Dr. Thomas Reynolds", role: "Director de Laboratorio", rating: 5, comment: "Respuesta rápida y profesional tras un derrame químico." },
        { name: "María Sánchez", role: "Gerente de Seguridad Industrial", rating: 5, comment: "Su experiencia normativa nos da confianza total." },
        { name: "Robert Chen", role: "Propietario de Inmueble", rating: 4, comment: "Solución eficiente en situación compleja." },
      ],
    },
  },
  FIRE: {
    cleaning: {
      image: fire,
      title: "Servicios de Limpieza por Daños de Incendio",
      shortDesc:
        "Restauración y limpieza especializada tras incendios y daños por humo.",
      longDesc:
        "Atendemos propiedades afectadas por fuego y hollín, eliminando residuos, neutralizando olores y restaurando superficies con técnicas avanzadas y equipo especializado.",
      features: [
        { title: "Respuesta de emergencia y evaluación de daños", description: "Actuamos rápido una vez declarado seguro el acceso.", },
        { title: "Eliminación de hollín y residuos de humo", description: "Desprendemos y limpiamos partículas ácidas con métodos secos y húmedos.", },
        { title: "Técnicas avanzadas de neutralización de olores", description: "Fogging térmico, ozono y tratamientos con hydroxyl.", },
        { title: "Limpieza y restauración de objetos recuperables", description: "Salvamos muebles, textiles y documentos siempre que sea posible.", },
        { title: "Descontaminación de sistemas HVAC", description: "Removemos partículas incrustadas en ductos y filtros.", },
        { title: "Remediación de daños por agua de extinción", description: "Extraemos agua y secamos estructuras tras el combate.", },
        { title: "Coordination with insurance companies", description: "Proporcionamos informes detallados y listados de costos.", },
      ],
      process: [
        "Evaluación de Daños y Plan de Restauración",
        "Desarrollo de Estrategia de Limpieza",
        "Ejecución de Restauración Especializada",
        "Inspección Final y Verificación",
      ],
      benefits: [
        { title: "Restauración Integral", description: "Atención completa a hollín, humo y agua.", icon: Flame },
        { title: "Prevención de Daños Secundarios", description: "Intervención rápida para evitar corrosión.", icon: Shield },
        { title: "Eliminación de Olores", description: "Neutralizamos olores de raíz, no solo los enmascaramos.", icon: Wind },
        { title: "Salvamento de Bienes", description: "Recuperamos muebles y pertenencias valiosas.", icon: Award },
      ],
      faqs: [
        { question: "¿Cuándo iniciar limpieza tras un incendio?", answer: "Tan pronto como sea seguro; el hollín es corrosivo.", },
        { question: "¿Eliminan completamente el olor a humo?", answer: "Sí, con técnicas de fogging, ozono y limpieza profunda.", },
        { question: "¿Pueden restaurar documentos y fotos?", answer: "Ofrecemos técnicas de secado y limpieza especializadas.", },
        { question: "¿Trabajan con aseguradoras?", answer: "Sí, entregamos informes y documentación completa.", },
        { question: "¿Cuánto tarda el proceso?", answer: "Depende de la magnitud, pero típicamente 1-3 semanas.", },
      ],
      testimonials: [
        { name: "Jennifer y David Wilson", role: "Propietarios", rating: 5, comment: "Recuperaron nuestra casa y pertenencias tras un incendio devastador." },
        { name: "Mark Thompson", role: "Dueño de Restaurante", rating: 5, comment: "Reabrimos antes de lo esperado gracias a su rapidez." },
        { name: "Sarah Johnson", role: "Administradora", rating: 4, comment: "Profesionales y compasivos en un momento difícil." },
      ],
    },
  },
  WATER: {
    cleaning: {
      image: water,
      title: "Servicios de Limpieza por Daños de Agua",
      shortDesc:
        "Extracción de agua, secado y restauración tras inundaciones o filtraciones.",
      longDesc:
        "Ofrecemos respuesta 24/7 para extraer agua, secar estructuras, limpiar y desinfectar superficies, previniendo moho y daños secundarios.",
      features: [
        { title: "Extracción de agua de emergencia 24/7", description: "Llegamos en 1–2 horas para minimizar daños.", },
        { title: "Detección y monitoreo de humedad", description: "Usamos medidores y cámaras térmicas para asegurar secado completo.", },
        { title: "Deshumidificadores industriales", description: "Secado rápido y controlado de paredes y suelos.", },
        { title: "Tratamientos antimicrobianos", description: "Previene crecimiento de moho y bacterias.", },
        { title: "Limpieza y desinfección de superficies", description: "Eliminamos contaminantes y olores.", },
        { title: "Secado estructural de cavidades", description: "Asegura ausencia de humedad en muros y techos.", },
        { title: "Restauración de contenidos", description: "Secado y limpieza de muebles, alfombras y textiles.", },
        { title: "Documentación para seguros", description: "Informes con fotos y mediciones de humedad.", },
        { title: "Control de olores y desodorización", description: "Tratamientos especializados post-secado.", },
        { title: "Prevención de moho", description: "Aplicamos biocidas y monitoreo post-servicio.", },
      ],
      process: [
        "Evaluación y Extracción de Agua",
        "Desarrollo de Plan de Secado",
        "Secado y Sanitización Profesional",
        "Verificación de Humedad Final",
      ],
      benefits: [
        { title: "Eliminación Rápida de Agua", description: "Minimiza daños y previene moho.", icon: Droplets },
        { title: "Prevención de Moho", description: "Tratamientos antimicrobianos efectivos.", icon: Shield },
        { title: "Restauración Integral", description: "Desde extracción hasta sanitización.", icon: Award },
        { title: "Proceso Científico", description: "Monitoreo constante con equipos avanzados.", icon: Users },
      ],
      faqs: [
        { question: "¿Cuánto tardan en llegar?", answer: "1–2 horas tras su llamada de emergencia.", },
        { question: "¿Cuánto dura el secado?", answer: "3–5 días en promedio, según gravedad.", },
        { question: "¿Salvan alfombras?", answer: "Sí, si el agua no está muy contaminada.", },
        { question: "¿Trabajan con aseguradoras?", answer: "Sí, documentamos para reclamos.", },
        { question: "¿Cómo evitan moho?", answer: "Secado rápido y biocidas específicos.", },
      ],
      testimonials: [
        { name: "Michael y Lisa Rodriguez", role: "Propietarios", rating: 5, comment: "Salvaron nuestros pisos de madera tras una fuga importante." },
        { name: "James Wilson", role: "Gerente de Oficina", rating: 5, comment: "Minimizaron nuestro tiempo de inactividad con su respuesta eficiente." },
        { name: "Patricia Thompson", role: "Dueña de Propiedad", rating: 4, comment: "Profesionales y comunicativos durante todo el proceso." },
      ],
    },
  },
  MOVE: {
    cleaning: {
      image: move,
      title: "Servicios de Limpieza de Mudanza",
      shortDesc:
        "Limpieza exhaustiva para mudanzas, dejando el espacio impecable para nuevos ocupantes.",
      longDesc:
        "Ofrecemos limpieza detallada en mudanzas de entrada y salida, abordando áreas olvidadas por el uso previo y garantizando un espacio listo para inspecciones o nuevo arrendatario.",
      features: [
        { title: "Limpieza profunda de todas las habitaciones", description: "Incluye rincones, armarios y electrodomésticos interiores.", },
        { title: "Limpieza detallada de cocina", description: "Electrodomésticos, gabinetes y encimeras libres de grasa.", },
        { title: "Desincrustación de baños", description: "Juntas, azulejos y sanitarios relucientes.", },
        { title: "Limpieza de zócalos y marcos", description: "Eliminamos polvo y manchas en molduras.", },
        { title: "Lavado de ventanas y rieles", description: "Cristales sin rayas y rieles libres de polvo.", },
        { title: "Interior de gabinetes y cajones", description: "Limpiamos y organizamos espacios de almacenamiento.", },
        { title: "Retiro de ganchos y clavos", description: "Sellamos pequeños agujeros si lo solicita el cliente.", },
        { title: "Limpieza de suelos según tipo", description: "Aspirado, fregado o pulido según material.", },
        { title: "Desempolvado de ventiladores y lámparas", description: "Eliminamos polvo en áreas altas.", },
        { title: "Limpieza de paredes y eliminación de marcas", description: "Atención a manchas y rayones leves.", },
      ],
      process: [
        "Evaluación Inicial de la Propiedad",
        "Plan de Limpieza Personalizado",
        "Ejecución Detallada de Limpieza",
        "Inspección Final y Verificación",
      ],
      benefits: [
        { title: "Depósito Garantizado", description: "Incrementa las posibilidades de devolución total de su depósito.", icon: Home },
        { title: "Menos Estrés", description: "Libera la carga de la limpieza durante la mudanza.", icon: Shield },
        { title: "Listo para Mudanza", description: "Espacio limpio y desinfectado antes de acomodar sus pertenencias.", icon: Award },
        { title: "Presentación Profesional", description: "Mejora la impresión para inquilinos o compradores.", icon: Users },
      ],
      faqs: [
        { question: "¿Cuándo programar la limpieza de salida?", answer: "1–2 días antes de la entrega de llaves tras retirar sus pertenencias.", },
        { question: "¿Cuánto dura?", answer: "3–5 horas para apartamentos estándar, más para casas grandes.", },
        { question: "¿Necesito estar presente?", answer: "No es obligatorio, pero facilite acceso y verificación final.", },
        { question: "¿Difiere de la limpieza regular?", answer: "Sí, incluye interiores de electrodomésticos, armarios y molduras.", },
        { question: "¿Ofrecen para comercios?", answer: "Sí, adaptamos el servicio a oficinas y locales comerciales.", },
      ],
      testimonials: [
        { name: "Emma Johnson", role: "Inquilina", rating: 5, comment: "¡Salvaron mi depósito con su limpieza impecable!" },
        { name: "Daniel Garcia", role: "Administrador", rating: 5, comment: "Servicio constante y detallista en cada mudanza.", },
        { name: "Sophia Williams", role: "Propietaria", rating: 4, comment: "Empezar de cero en mi nueva casa fue maravilloso.", },
      ],
    },
  },
  DECEASED: {
    cleaning: {
      image: deceased,
      title: "Servicios de Limpieza de Propiedades tras Fallecimiento",
      shortDesc:
        "Limpieza compasiva y discreta tras el fallecimiento de un ser querido.",
      longDesc:
        "Ofrecemos un servicio respetuoso y detallado para limpiar, desinfectar y preparar la vivienda tras un fallecimiento, permitiéndole enfocarse en el duelo.",
      features: [
        { title: "Servicio discreto y compasivo", description: "Atención sensible en momentos difíciles.", },
        { title: "Manejo cuidadoso de pertenencias", description: "Organizamos y protegemos objetos de valor sentimental.", },
        { title: "Limpieza completa y sanitización", description: "Desinfección profunda en todas las áreas.", },
        { title: "Limpieza de biohazard si es necesario", description: "Protocolo específico para riesgos biológicos.", },
        { title: "Eliminación de olores y purificación", description: "Tratamientos avanzados para neutralizar malos olores.", },
        { title: "Retiro de objetos no deseados", description: "Clasificamos y desechamos según indicaciones.", },
        { title: "Limpieza de áreas descuidadas", description: "Atención a espacios con mucho polvo o suciedad.", },
        { title: "Preparación para venta o alquiler", description: "Dejamos la propiedad lista para su próximo uso.", },
        { title: "Coordinación con albaceas", description: "Trabajamos con familiares y representantes.", },
        { title: "Horario flexible", description: "Nos adaptamos a sus necesidades y tiempos.", },
      ],
      process: [
        "Consulta y Evaluación Sensible",
        "Desarrollo de Plan Personalizado",
        "Limpieza Respetuosa y Preparación",
        "Inspección Final y Entrega",
      ],
      benefits: [
        { title: "Apoyo Compasivo", description: "Alivio de la carga de limpiar en duelo.", icon: Shield },
        { title: "Sanitización y Eliminación de Olores", description: "Ambiente limpio y libre de malos olores.", icon: Wind },
        { title: "Preservación de Recuerdos", description: "Protegemos objetos sentimentales.", icon: Award },
        { title: "Preparación para Próximos Pasos", description: "Listo para uso familiar, venta o alquiler.", icon: Skull },
      ],
      faqs: [
        { question: "¿Cómo tratan pertenencias sentimentales?", answer: "Separamos y etiquetamos objetos para revisión familiar.", },
        { question: "¿Atienden propiedades abandonadas?", answer: "Sí, con técnicas para polvo, moho y plagas.", },
        { question: "¿Ofrecen biohazard cleaning?", answer: "Sí, con protocolos y equipo especializado.", },
        { question: "¿Cuándo pueden iniciar?", answer: "En 24–48 horas tras la solicitud.", },
        { question: "¿Garantizan discreción?", answer: "Llegamos en vehículos sin distintivos y vestimenta neutra.", },
      ],
      testimonials: [
        { name: "Richard Thompson", role: "Familiar", rating: 5, comment: "Su compasión facilitó un momento muy difícil." },
        { name: "Elizabeth Chen", role: "Albacea", rating: 5, comment: "Transformaron una propiedad descuidada en un espacio limpio." },
        { name: "Michael Davis", role: "Abogado", rating: 4, comment: "Recomiendo su discreción y profesionalismo." },
      ],
    },
  },
  EXPLOSIVE: {
    cleaning: {
      image: explosive,
      title: "Servicios de Limpieza de Residuos Explosivos",
      shortDesc:
        "Descontaminación experta de partículas explosivas y materiales peligrosos.",
      longDesc:
        "Nuestro equipo altamente entrenado remueve residuos de explosivos, polvo de disparo y contaminantes tóxicos siguiendo normativas de seguridad estrictas.",
      features: [
        { title: "Técnicos especializados en residuos explosivos", description: "Formación en manejo seguro de partículas peligrosas.", },
        { title: "Mapeo y evaluación de contaminación", description: "Identificamos áreas afectadas antes de limpiar.", },
        { title: "Contención y aislamiento adecuados", description: "Barreras para evitar dispersión de micropartículas.", },
        { title: "Eliminación visible y microscópica", description: "Técnicas húmedas y secas para partículas pequeñas.", },
        { title: "Agentes de limpieza específicos", description: "Formulaciones para cada tipo de residuo.", },
        { title: "PPE de alta protección", description: "Trajes y respiradores certificados.", },
        { title: "Descontaminación de superficies múltiples", description: "Materiales porosos y no porosos.", },
        { title: "Monitoreo de calidad de aire", description: "Detección de partículas en suspensión.", },
        { title: "Documentación para seguros y auditorías", description: "Informes de pruebas y limpieza.", },
        { title: "Verificación post-limpieza", description: "Testigos para asegurar no residual.", },
      ],
      process: [
        "Evaluación de Seguridad y Contaminación",
        "Plan de Contención y Limpieza",
        "Remoción Especializada",
        "Pruebas y Verificación Final",
      ],
      benefits: [
        { title: "Manejo Experto de Residuos", description: "Eliminación segura de partículas explosivas.", icon: Bomb },
        { title: "Descontaminación Completa", description: "Visibles y microscópicas.", icon: Shield },
        { title: "Cumplimiento Legal", description: "Adherencia a regulaciones vigentes.", icon: Award },
        { title: "Informes Detallados", description: "Certificados para seguros y auditorías.", icon: Users },
      ],
      faqs: [
        { question: "¿Qué residuos manejan?", answer: "Polvo de disparo, residuos industriales y pirotecnia.", },
        { question: "¿Por qué es necesaria limpieza profesional?", answer: "Residuos tóxicos y reactivos pueden ser peligrosos.", },
        { question: "¿Cómo garantizan seguridad?", answer: "Protocolos estrictos de contención y PPE.", },
        { question: "¿Qué pruebas utilizan?", answer: "Muestreo de superficies y aire.", },
        { question: "¿Tiempo de respuesta?", answer: "Generalmente 24 horas tras la solicitud.", },
      ],
      testimonials: [
        { name: "Captain James Wilson", role: "Oficial de Policía", rating: 5, comment: "Servicio rápido y conforme a protocolos oficiales." },
        { name: "Dr. Sarah Martinez", role: "Directora de Laboratorio", rating: 5, comment: "Limpieza minuciosa y documentación clara." },
        { name: "Thomas Reynolds", role: "Administrador", rating: 4, comment: "Solución eficiente en un entorno complejo." },
      ],
    },
  },
  MOLD: {
    cleaning: {
      image: mold,
      title: "Servicios de Remediación de Moho",
      shortDesc:
        "Eliminación y prevención de moho con técnicas certificadas.",
      longDesc:
        "Inspeccionamos, contenemos y eliminamos moho visible y oculto usando equipos HEPA, biocidas y protocolos para evitar su regreso.",
      features: [
        { title: "Inspección y evaluación de moho", description: "Muestreo visual y de laboratorio si es necesario.", },
        { title: "Detección avanzada de humedad", description: "Mapeamos fuentes para prevenir futuros brotes.", },
        { title: "Contención y filtración HEPA", description: "Evita dispersión durante la remediación.", },
        { title: "Remoción segura de materiales afectados", description: "Eliminamos y reemplazamos paneles, sellos y aislantes.", },
        { title: "Biocidas para prevenir reaparición", description: "Tratamientos residuales de larga duración.", },
        { title: "Secado y deshumidificación", description: "Equipos industriales garantizan ambiente seco.", },
        { title: "Pruebas post-remediación", description: "Verificamos ausencia de colonias nuevas.", },
        { title: "Recomendaciones preventivas", description: "Soluciones para corregir filtraciones y ventilación.", },
        { title: "Documentación para seguros", description: "Informes completos con fotos y datos.", },
        { title: "Monitoreo continuo opcional", description: "Servicios de seguimiento periódico.", },
      ],
      process: [
        "Inspección y Muestreo",
        "Desarrollo de Plan de Remediación",
        "Limpieza y Prevención Profesional",
        "Verificación y Certificación Final",
      ],
      benefits: [
        { title: "Protección de Salud", description: "Reducción de alérgenos y compuestos tóxicos.", icon: Shield },
        { title: "Conservación Estructural", description: "Evita daños en madera y yeso.", icon: Building },
        { title: "Eliminación Completa", description: "Moho visible y oculto bajo control.", icon: Award },
        { title: "Prevención a Largo Plazo", description: "Soluciones para evitar reapariciones.", icon: Users },
      ],
      faqs: [
        { question: "¿Cómo identifican moho?", answer: "Inspección visual, pruebas de aire y superficie.", },
        { question: "¿Es necesaria prueba si veo moho?", answer: "Útil para determinar alcance y tipo.", },
        { question: "¿Cómo previenen dispersión?", answer: "Barreras y filtración HEPA.", },
        { question: "¿Se puede eliminar permanentemente?", answer: "Con corrección de humedad, sí.", },
        { question: "¿Cuánto tarda?", answer: "1-2 días para áreas pequeñas; más para proyectos grandes.", },
      ],
      testimonials: [
        { name: "Rebecca Anderson", role: "Propietaria", rating: 5, comment: "Nuestro sótano está libre de moho y con mejor aire." },
        { name: "David Chen", role: "Administrador Comercial", rating: 5, comment: "Minimizaron interrupciones en nuestra oficina." },
        { name: "Jennifer Martinez", role: "Propietaria de Alquiler", rating: 4, comment: "Detectaron y resolvieron fuga subyacente." },
      ],
    },
  },
  CONSTRUCTION: {
    cleaning: {
      image: construction,
      title: "Servicios de Limpieza Post-Construcción",
      shortDesc:
        "Limpieza completa tras obras, eliminando escombros, polvo y residuos de construcción.",
      longDesc:
        "Transformamos zonas de obra en espacios habitables, removiendo polvo, adhesivos y residuos con técnicas y equipos especializados para dejarlo todo listo para ocupar.",
      features: [
        {
          title: "Eliminación de polvo fino",
          description: "Usamos aspiradoras HEPA y paños de microfibra para capturar partículas invisibles."
        },
        {
          title: "Limpieza de ductos y ventilación",
          description: "Despejamos aireadores y conductos de polvo y escombros acumulados."
        },
        {
          title: "Retiro de adhesivos y películas protectoras",
          description: "Aplicamos solventes seguros que no dañan acabados."
        },
        {
          title: "Lavado de ventanas y marcos",
          description: "Cristales y perfiles libres de manchas y residuos."
        },
        {
          title: "Limpieza interior de gabinetes",
          description: "Desempolvamos y sanitizamos cada espacio de almacenamiento."
        },
        {
          title: "Sanitización de baños nuevos",
          description: "Eliminamos restos de cemento y lechada de azulejos."
        },
        {
          title: "Limpieza de interruptores y enchufes",
          description: "Barremos residuos con cuidado para asegurar su correcto funcionamiento."
        },
        {
          title: "Cuidado de pisos según tipo",
          description: "Aspirado, fregado o pulido profesional, según el material."
        },
        {
          title: "Retiro de escombros y empaques",
          description: "Eliminamos embalajes, clavos y fragmentos sobrantes."
        },
        {
          title: "Detalle final de inspección",
          description: "Revisión exhaustiva antes de su entrega para garantizar calidad."
        },
      ],
      faqs: [
        {
          question: "¿Cuándo debo programar la limpieza post-construcción?",
          answer: "Después de finalizar toda la obra y antes de amoblar, idealmente 1–2 días antes de la entrega."
        },
        {
          question: "¿Cómo eliminan el polvo fino?",
          answer: "Con aspiradoras HEPA y múltiples pasadas de paño de microfibra para un acabado impecable."
        },
        {
          question: "¿Retiran adhesivos y películas protectoras?",
          answer: "Sí, utilizamos solventes adecuados que respetan cada tipo de superficie."
        },
        {
          question: "¿Limpiarán el interior de armarios y gabinetes?",
          answer: "Por supuesto: desempolvamos, desinfectamos y organizamos sus espacios de almacenamiento."
        },
        {
          question: "¿Cuánto dura este servicio?",
          answer: "Generalmente de 1 a 2 días, según el tamaño y la complejidad del proyecto."
        },
      ],
      testimonials: [
        {
          name: "Robert Johnson",
          role: "Propietario",
          rating: 5,
          comment:
            "Tras la remodelación, dejaron nuestra casa impecable ¡hasta en los rincones más difíciles!"
        },
        {
          name: "Maria Garcia",
          role: "Constructora",
          rating: 5,
          comment:
            "Su trabajo consistente acelera nuestras entregas y asegura clientes satisfechos."
        },
        {
          name: "Thomas Wilson",
          role: "Desarrollador",
          rating: 4,
          comment:
            "Entregamos propiedades listas para habitar sin retrasos gracias a su equipo."
        },
      ],
    },
  },

  COMMERCIAL: {
    cleaning: {
      image: commercial,
      title: "Servicios de Limpieza Comercial",
      shortDesc:
        "Soluciones profesionales para mantener espacios de trabajo limpios, sanos y productivos.",
      longDesc:
        "Diseñamos planes a medida para oficinas, tiendas y locales, utilizando técnicas industriales y productos de alta eficacia para sus necesidades específicas.",
      features: [
        {
          title: "Planes personalizables",
          description: "Ajustados a frecuencia, horario y áreas de su negocio."
        },
        {
          title: "Áreas comunes impecables",
          description: "Recepciones, pasillos y salas de espera siempre presentables."
        },
        {
          title: "Desinfección de superficies clave",
          description: "Mesas, manijas, interruptores y equipos libre de gérmenes."
        },
        {
          title: "Productos ecológicos y seguros",
          description: "Cumplen normativas y protegen a empleados y visitantes."
        },
        {
          title: "Opciones de frecuencia",
          description: "Servicios diarios, semanales o mensuales según conveniencia."
        },
        {
          title: "Detalle de mobiliario y equipos",
          description: "Limpieza profunda de escritorios, sillas y dispositivos electrónicos."
        },
        {
          title: "Mantenimiento de suelos",
          description: "Alfombras, pisos de madera y cerámica en perfecto estado."
        },
        {
          title: "Cristales y ventanas exteriores",
          description: "Visibilidad y estética mejoradas en fachadas y escaparates."
        },
        {
          title: "Control de polvo general",
          description: "Reducción de alérgenos y contaminantes en el ambiente."
        },
        {
          title: "Sanitización de baños comerciales",
          description: "Protocolos de higiene óptimos para uso intensivo."
        },
      ],
      process: [
        "Evaluación y consulta inicial",
        "Elaboración de plan comercial",
        "Ejecución profesional",
        "Inspección y feedback continuo",
      ],
      benefits: [
        {
          title: "Mejora de imagen",
          description: "Espacios pulcros que causan buena impresión.",
          icon: Briefcase
        },
        {
          title: "Entorno saludable",
          description: "Menor contaminación y mejor calidad de aire.",
          icon: Shield
        },
        {
          title: "Mayor productividad",
          description: "Ambiente ordenado que facilita la concentración.",
          icon: Clock
        },
        {
          title: "Flexibilidad",
          description: "Adaptamos servicios al crecimiento de su empresa.",
          icon: Users
        },
      ],
      faqs: [
        {
          question: "¿Interfiere en el horario laboral?",
          answer:
            "Programamos fuera de horas pico o fines de semana para minimizar interrupciones."
        },
        {
          question: "¿Atienden sectores específicos?",
          answer:
            "Sí, tenemos experiencia en salud, hostelería, retail, oficinas y más."
        },
        {
          question: "¿Proporcionan sus propios equipos?",
          answer:
            "Traemos todos los suministros y maquinaria necesaria para el servicio."
        },
        {
          question: "¿Cómo garantizan la calidad?",
          answer:
            "Inspecciones periódicas y listas de verificación nos aseguran un estándar alto."
        },
        {
          question: "¿Puedo modificar el plan?",
          answer:
            "Claro, su administrador de cuenta ajustará frecuencias y alcance cuando lo necesite."
        },
      ],
      testimonials: [
        {
          name: "Robert Anderson",
          role: "Gerente de Oficina",
          rating: 5,
          comment:
            "Nuestro espacio refleja profesionalismo desde el momento en que entra un cliente."
        },
        {
          name: "Lisa Martinez",
          role: "Propietaria de Tienda",
          rating: 5,
          comment:
            "La limpieza constante ha mejorado la experiencia de compra de nuestros clientes."
        },
        {
          name: "David Wilson",
          role: "Administrador Médico",
          rating: 4,
          comment:
            "Cumplen con los protocolos sanitarios más estrictos en entornos de salud."
        },
      ],
    },
  },
}

export { serviceInfo, serviceInfoES };
