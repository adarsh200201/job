// Centralized Mappings and Dynamic Content Templates for Programmatic SEO

export const STATE_MAPPINGS = {
  'andaman-nicobar': { name: 'Andaman & Nicobar', query: 'Andaman' },
  'andhra-pradesh': { name: 'Andhra Pradesh', query: 'Andhra' },
  'arunachal-pradesh': { name: 'Arunachal Pradesh', query: 'Arunachal' },
  'assam': { name: 'Assam', query: 'Assam' },
  'bihar': { name: 'Bihar', query: 'Bihar' },
  'chandigarh': { name: 'Chandigarh', query: 'Chandigarh' },
  'chhattisgarh': { name: 'Chhattisgarh', query: 'Chhattisgarh' },
  'delhi': { name: 'Delhi', query: 'Delhi' },
  'dnh-dd': { name: 'Dadra Nagar Haveli & Daman Diu', query: 'Daman' },
  'goa': { name: 'Goa', query: 'Goa' },
  'gujarat': { name: 'Gujarat', query: 'Gujarat' },
  'haryana': { name: 'Haryana', query: 'Haryana' },
  'himachal-pradesh': { name: 'Himachal Pradesh', query: 'Himachal' },
  'jammu-kashmir': { name: 'Jammu & Kashmir', query: 'Jammu' },
  'jharkhand': { name: 'Jharkhand', query: 'Jharkhand' },
  'karnataka': { name: 'Karnataka', query: 'Karnataka' },
  'kerala': { name: 'Kerala', query: 'Kerala' },
  'ladakh': { name: 'Ladakh', query: 'Ladakh' },
  'lakshadweep': { name: 'Lakshadweep', query: 'Lakshadweep' },
  'madhya-pradesh': { name: 'Madhya Pradesh', query: 'Madhya' },
  'maharashtra': { name: 'Maharashtra', query: 'Maharashtra' },
  'manipur': { name: 'Manipur', query: 'Manipur' },
  'meghalaya': { name: 'Meghalaya', query: 'Meghalaya' },
  'mizoram': { name: 'Mizoram', query: 'Mizoram' },
  'nagaland': { name: 'Nagaland', query: 'Nagaland' },
  'odisha': { name: 'Odisha', query: 'Odisha' },
  'puducherry': { name: 'Puducherry', query: 'Puducherry' },
  'punjab': { name: 'Punjab', query: 'Punjab' },
  'rajasthan': { name: 'Rajasthan', query: 'Rajasthan' },
  'sikkim': { name: 'Sikkim', query: 'Sikkim' },
  'tamil-nadu': { name: 'Tamil Nadu', query: 'Tamil' },
  'telangana': { name: 'Telangana', query: 'Telangana' },
  'tripura': { name: 'Tripura', query: 'Tripura' },
  'uttar-pradesh': { name: 'Uttar Pradesh', query: 'Uttar' },
  'uttarakhand': { name: 'Uttarakhand', query: 'Uttarakhand' },
  'west-bengal': { name: 'West Bengal', query: 'West Bengal' },
  
  // State Aliases/Abbrevations
  'up': { name: 'Uttar Pradesh', query: 'Uttar', aliasOf: 'uttar-pradesh' },
  'mp': { name: 'Madhya Pradesh', query: 'Madhya', aliasOf: 'madhya-pradesh' },
  'ap': { name: 'Andhra Pradesh', query: 'Andhra', aliasOf: 'andhra-pradesh' },
  'hp': { name: 'Himachal Pradesh', query: 'Himachal', aliasOf: 'himachal-pradesh' },
  'jk': { name: 'Jammu & Kashmir', query: 'Jammu', aliasOf: 'jammu-kashmir' },
  'wb': { name: 'West Bengal', query: 'West Bengal', aliasOf: 'west-bengal' },
  'tn': { name: 'Tamil Nadu', query: 'Tamil', aliasOf: 'tamil-nadu' },
  'uk': { name: 'Uttarakhand', query: 'Uttarakhand', aliasOf: 'uttarakhand' }
};

export const QUALIFICATION_MAPPINGS = {
  '10th-pass': { name: '10th Pass', query: '10th' },
  '12th-pass': { name: '12th Pass', query: '12th' },
  'graduate': { name: 'Graduate', query: 'graduate' },
  'post-graduate': { name: 'Post Graduate', query: 'post graduate' },
  'diploma': { name: 'Diploma', query: 'diploma' },
  'iti': { name: 'ITI', query: 'ITI' },
  'engineering': { name: 'Engineering', query: 'Engineer' },
  'medical': { name: 'Medical', query: 'Medical' },
  'teaching': { name: 'Teaching', query: 'Teacher' },
  'computer-it': { name: 'Computer & IT', query: 'Computer' },
  'commerce': { name: 'Commerce & Finance', query: 'Commerce' },
  'law': { name: 'Law & Judicial', query: 'Law' },
  
  // Qualification Aliases/Abbrevations
  'btech': { name: 'B.Tech / B.E.', query: 'B.Tech', aliasOf: 'engineering' },
  'mtech': { name: 'M.Tech', query: 'M.Tech', aliasOf: 'engineering' },
  'bsc': { name: 'B.Sc', query: 'B.Sc', aliasOf: 'graduate' },
  'bca': { name: 'BCA', query: 'BCA', aliasOf: 'computer-it' },
  'mca': { name: 'MCA', query: 'MCA', aliasOf: 'computer-it' },
  'mba': { name: 'MBA', query: 'MBA', aliasOf: 'post-graduate' },
  'bcom': { name: 'B.Com', query: 'B.Com', aliasOf: 'commerce' }
};

export const CATEGORY_MAPPINGS = {
  'ssc': { name: 'SSC', query: 'SSC' },
  'railway': { name: 'Railway', query: 'Railway' },
  'bank': { name: 'Bank', query: 'Bank' },
  'upsc': { name: 'UPSC', query: 'UPSC' },
  'defence': { name: 'Defence', query: 'Defence' },
  'psu': { name: 'PSU', query: 'PSU' },
  'police': { name: 'Police', query: 'Police' }
};

export function generateSEOTemplates(parsedInfo) {
  const { type, name, stateName } = parsedInfo;
  
  let h1 = "";
  let metaTitle = "";
  let metaDescription = "";
  let intro = "";
  let eligibility = "";
  let salary = "";
  let selection = "";
  let apply = "";
  let faqs = [];

  if (type === 'state') {
    h1 = `Government Jobs in ${stateName} 2026`;
    metaTitle = `Government Jobs in ${stateName} 2026 – Latest ${stateName} Govt Recruitment`;
    metaDescription = `Find the latest government jobs in ${stateName} for 2026. Get state recruitment notifications, exam schedules, and direct links to apply online for multiple posts.`;
    
    intro = `Welcome to the comprehensive directory of Government Jobs in ${stateName} for 2026. NextJobPost is your primary hub for tracking all recruitment notifications issued by the state departments, boards, and public sector undertakings of ${stateName}, as well as central government organizations operating within the state. Whether you are seeking administrative posts, police department opportunities, health department vacancies, or public service commission appointments, we consolidate and update all verified listings in real-time. Aspiring candidates can find direct application links, exam guidelines, and notifications to jumpstart their career in the public sector.`;
    
    eligibility = `To qualify for state government vacancies in ${stateName}, candidates must meet the specified age limits, residency rules, and educational requirements. Generally, the age threshold is 18 to 38 years, with relaxation policies in place for reserved categories (SC, ST, OBC, PwD, and Ex-Servicemen) as mandated by the state policies. The academic eligibility ranges from matriculation (10th pass) or higher secondary education (12th pass) for junior administrative or support roles, up to professional graduation degrees or postgraduate diplomas for executive and officer positions. Knowledge of the regional language of ${stateName} is frequently required or preferred for local public service positions.`;
    
    salary = `Salaries for government employees in ${stateName} are structured under the 7th Pay Commission recommendations and local state pay scales. Junior assistant and support staff posts typically fall under Level 1 or Level 2, with base pay starting at ₹19,900 to ₹25,200 per month, supplemented by House Rent Allowance (HRA), Dearness Allowance (DA), and medical benefits. Officers, administrative cadres, and educational specialists hold positions starting at Pay Level 6 and higher, commanding initial monthly salaries of ₹35,400 to ₹56,100. Higher administrative roles receive executive pay bands along with official housing and travel provisions.`;
    
    selection = `The recruitment board of ${stateName} employs a strict merit-based selection framework:
    1. **Preliminary Screenings / Written Examination**: Consists of multiple-choice questions assessing regional geography, general knowledge, reasoning, arithmetic, and basic language skills.
    2. **Physical / Skill Test**: Required for specific departments like local Police forces or forest guards, validating candidate agility and physical parameters, or computer typing tests for data entry operators.
    3. **Personal Interview**: Structured for Group A & Group B positions to gauge administrative competence and soft skills.
    4. **Document Verification**: Exhaustive check of educational documents, regional domicile proofs, and category certificates.
    5. **Final Medical Evaluation**: Ensures candidates meet the physical fitness guidelines before final appointment.`;
    
    apply = `Applying online for ${stateName} government jobs is straightforward:
    1. Navigate to the official website of the recruiting department or the State Public Service Commission (PSC) website.
    2. Locate the "Recruitment" or "Online Application" dashboard and select the active advertisement you wish to apply for.
    3. Create a unique username/password profile by submitting your email address and active mobile number.
    4. Complete the registration form with accurate details regarding your personal identity, residency, and educational history.
    5. Upload scanned documents (passport photograph, signature, and qualifications certificates) conforming to the prescribed size limit.
    6. Complete payment of the application fees using a secure online banking, credit/debit card, or UPI portal.
    7. Print out the generated application form and confirmation slip for records.`;
    
    faqs = [
      {
        q: `What are the top recruiting boards in ${stateName}?`,
        a: `The primary recruiting boards include the State Public Service Commission (PSC), State Staff Selection Board (SSB), Police Recruitment Board, Electricity Distribution Board, and Education Department boards.`
      },
      {
        q: `Is regional language proficiency mandatory for jobs in ${stateName}?`,
        a: `For many state government positions, particularly public-facing administrative roles, proficiency in reading, writing, and speaking the official state language is a mandatory requirement.`
      },
      {
        q: `What is the upper age limit for applying in ${stateName}?`,
        a: `The general upper age limit is 38 years for general category applicants. However, candidates belonging to reserved classes like SC/ST/OBC, state government employees, and disabled veterans receive age relaxations ranging from 3 to 10 years.`
      },
      {
        q: `How do I receive immediate alerts for ${stateName} job updates?`,
        a: `You can bookmark NextJobPost, join our Telegram updates channel, or subscribe to our web notification feed to receive immediate updates on your phone or desktop.`
      },
      {
        q: `Can candidates from other states apply for posts in ${stateName}?`,
        a: `Yes, but they are typically treated under the general (unreserved) category and will not be eligible for regional domicile-based reservations or age relaxations unless specified in the official notification.`
      }
    ];
  } else if (type === 'qualification_only') {
    h1 = `${name} Government Jobs 2026`;
    metaTitle = `${name} Government Jobs 2026 – Latest Vacancies & Recruitment`;
    metaDescription = `Find all government jobs for ${name} candidates in 2026. Explore central and state recruitment notifications, eligibility requirements, and direct application links.`;
    
    intro = `Welcome to NextJobPost's specialized portal for ${name} Government Jobs in 2026. Obtaining a secure public service position is a premier career pathway for candidates holding a ${name} qualification. Both central government boards (like Railways, SSC, Banking, and Defence) and various state departments regularly launch recruitment drives specifically targeted at this academic category. We track, verify, and consolidate these notifications from official gazettes and portals to provide you with the most reliable resource to launch your professional career.`;
    
    eligibility = `Academic eligibility requires a verified certificate or degree matching the ${name} criteria from a recognized board, technical institute, or university. Age parameters generally range from 18 to 30 years for central departments and up to 38/40 years for state-specific roles. Age concessions are actively granted to SC, ST, OBC, PwD, and ex-servicemen as per central and state government directives. Candidates should review physical standard requirements if applying to defence, police, or security departments.`;
    
    salary = `Salaries for ${name} positions are competitive and backed by extensive benefits. Entry-level vacancies (e.g. for 10th pass, 12th pass, or ITI holders) align with Levels 1 to 3 of the 7th Pay matrix, offering basic monthly pay scales from ₹18,000 to ₹25,500. Graduate or post-graduate positions enter at Level 5 to Level 7, with starting basic salaries between ₹29,200 and ₹44,900 per month. Additionally, government employees receive Dearness Allowance, HRA, Travel Allowance, pension advantages, and robust medical insurance.`;
    
    selection = `The selection methodology for ${name} government vacancies is highly structured:
    1. **Computer-Based Examination (CBE)**: A multiple-choice exam assessing general intelligence, mathematics, English grammar, general awareness, or specific domain subjects.
    2. **Skill / Trade Test**: Practical examinations testing proficiency (such as typing velocity, physical stamina, or computer coding/drafting) depending on the post details.
    3. **Document Assessment**: Rigorous checks of matriculation certificates, category certificates, academic transcripts, and identity cards.
    4. **Physical Standard Test (PST) / Medical Exam**: Mandatory assessment to establish physical capability for field, police, or defence duties.`;
    
    apply = `Follow this general outline to apply for jobs under this qualification:
    1. Access the official online recruitment portal of the target commission (such as SSC, Railway Recruitment Boards, or State PSCs).
    2. Locate the link for the relevant active advertisement and click 'Apply Online'.
    3. Register on the portal by entering basic details, generating a temporary registration number and login code.
    4. Complete the online application form with precise personal details, educational qualifications, and preferred exam center locations.
    5. Upload clear, high-resolution scans of your photograph, signature, and category certificates within size guidelines.
    6. Complete payment of the application fees via secure net banking, debit/credit cards, or mobile wallets.
    7. Save the registration receipt and submit the form.`;
    
    faqs = [
      {
        q: `What central government organizations recruit ${name} candidates?`,
        a: `Primary central recruiting bodies include the Staff Selection Commission (SSC), Railway Recruitment Board (RRB), Public Sector Banks, Indian Army, Navy, Air Force, and central research units.`
      },
      {
        q: `Is work experience mandatory for ${name} government jobs?`,
        a: `The majority of entry-level and intermediate vacancies for ${name} do not require prior experience, making them perfect career pathways for freshers.`
      },
      {
        q: `What is the standard application fee for these exams?`,
        a: `Application fees are usually nominal, ranging from ₹100 to ₹500. Under government policies, female candidates, SC, ST, PwD, and Ex-Servicemen are frequently exempt from application fees.`
      },
      {
        q: `Can I apply for multiple posts under this category?`,
        a: `Yes, you can apply for multiple exams across different recruiting bodies, provided you meet the individual age, physical standards, and academic criteria specified for each post.`
      },
      {
        q: `How long does the entire recruitment process take?`,
        a: `The recruitment process (from initial notification release to final appointment letter dispatch) typically spans between 6 to 12 months, depending on the number of selection phases.`
      }
    ];
  } else {
    // Combination Page (Qualification or Category in a State)
    h1 = `${name} Jobs in ${stateName} 2026`;
    metaTitle = `${name} Jobs in ${stateName} 2026 – Apply Online for Vacancies`;
    metaDescription = `Find the latest ${name} jobs in ${stateName} for 2026. Access state recruitment updates, qualification parameters, salary metrics, and application details.`;
    
    intro = `Welcome to the absolute resource for latest **${name} Jobs in ${stateName} 2026**. NextJobPost provides real-time tracking of all employment notices issued for candidates matching the ${name} criteria in the state of ${stateName}. This includes recruitment opportunities in state administrative bodies, public service commissions, electricity boards, public sector banks, and railway divisions within the state territory. Our listings are verified directly from official source gazettes to ensure you never miss a deadline.`;
    
    eligibility = `Academic eligibility requires candidates to hold a certificate, diploma, or degree matching the ${name} classification from an approved educational board or university. The age limitations usually span from 18 to 38 years, with relaxation policies of 3 to 10 years applicable for OBC, SC, ST, and disabled candidates. A regional language proficiency certificate or local residency credentials for ${stateName} may be requested for regional administrative posts.`;
    
    salary = `Salaries for ${name} positions in ${stateName} conform to the regional pay scale matrix and 7th Pay Commission directives. Starting compensation for entry-level posts typically ranges from ₹21,700 to ₹29,200 per month. Highly technical, engineering, or executive positions command higher pay bands, starting from ₹44,900 to ₹67,700 per month, supplemented by standard dearness allowances, HRA, medical coverage, and provident fund benefits.`;
    
    selection = `The selection process for ${name} openings in ${stateName} consists of standard evaluation stages:
    1. **Written Examination**: Multiple-choice format testing quantitative aptitude, logic reasoning, general awareness, and specific knowledge of ${stateName}.
    2. **Practical / Skill Test**: Typing tests, computer literacy evaluations, or physical efficiency tests as required by the specific job profile.
    3. **Document Screening**: Direct verification of qualification marksheets, caste certificates, and age proof.
    4. **Medical Review**: Health review by certified government medical boards to verify fitness for service.`;
    
    apply = `Apply online by following this checklist:
    1. Open the official application URL of the recruiting agency in ${stateName} (like the State Staff Selection Board or Department Career page).
    2. Click on the recruitment notice and read the full eligibility brochure.
    3. Perform initial registration with basic contact information.
    4. Fill in the online form, providing accurate academic details and contact info.
    5. Upload signature files, photos, and necessary documents.
    6. Complete fee payment via integrated payment gateways.
    7. Save and print the completed form.`;
    
    faqs = [
      {
        q: `What are the popular careers for ${name} in ${stateName}?`,
        a: `Popular options include Junior Assistants, Clerk typists, State Police officers, Technical assistants in electricity boards, and administrative cadres.`
      },
      {
        q: `Is knowledge of local language mandatory for ${name} jobs in ${stateName}?`,
        a: `Yes. Most state departments require candidates to have studied the local regional language up to 10th standard or pass a language proficiency test.`
      },
      {
        q: `Are there private sector options included on this page?`,
        a: `While the primary focus is public sector recruitment, we also list major private off-campus recruitment drives, software engineering roles, and internships available in the region.`
      },
      {
        q: `How frequently does NextJobPost update notifications?`,
        a: `We update listings in real-time, within minutes of the official PDF notification release by the recruiting boards.`
      },
      {
        q: `Can I apply for these jobs if I live outside ${stateName}?`,
        a: `Yes, for central government jobs. For state-specific jobs, you can apply but will be considered under the unreserved (General) category without relaxation benefits.`
      }
    ];
  }

  return { h1, metaTitle, metaDescription, intro, eligibility, salary, selection, apply, faqs };
}
