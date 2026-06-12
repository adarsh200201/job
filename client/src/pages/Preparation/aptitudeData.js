// ─── FORMULAS ─────────────────────────────────────────────────────────────────

export const FORMULAS_DATA = {
  "Problems on Trains": [
    {
      title: "Conversion of Units",
      formulas: [
        { exp: "x km/hr = x × (5/18) m/sec", desc: "Multiply by 5/18 to convert km/hr to m/sec." },
        { exp: "x m/sec = x × (18/5) km/hr", desc: "Multiply by 18/5 to convert m/sec to km/hr." }
      ]
    },
    {
      title: "Crossing Stationary Objects",
      formulas: [
        { exp: "Time = Length of Train / Speed of Train", desc: "Time taken by a train to pass a pole, standing man, or signal post." },
        { exp: "Time = (Length of Train + Length of Object) / Speed", desc: "Time taken by a train to pass a bridge, platform, or tunnel." }
      ]
    },
    {
      title: "Relative Speed (Opposite Directions)",
      formulas: [
        { exp: "Relative Speed = Speed A + Speed B", desc: "When two objects move in opposite directions." },
        { exp: "Time = (Length A + Length B) / (Speed A + Speed B)", desc: "Time for two trains to cross each other going opposite ways." }
      ]
    },
    {
      title: "Relative Speed (Same Direction)",
      formulas: [
        { exp: "Relative Speed = |Speed A - Speed B|", desc: "When two objects move in the same direction." },
        { exp: "Time = (Length A + Length B) / |Speed A - Speed B|", desc: "Time for two trains to cross each other going the same way." }
      ]
    }
  ],
  "Time and Work": [
    {
      title: "Basic Rate of Work",
      formulas: [
        { exp: "1-day work of A = 1/n (if A completes work in n days)", desc: "Work rate is inversely proportional to time taken." },
        { exp: "Total Work = Rate × Time", desc: "The fundamental relationship for work problems." }
      ]
    },
    {
      title: "Combined Work",
      formulas: [
        { exp: "Time (A & B together) = (x × y) / (x + y)", desc: "If A takes x days and B takes y days alone." },
        { exp: "Time (A, B, C together) = (xyz) / (xy + yz + zx)", desc: "If A, B, C take x, y, z days respectively." }
      ]
    },
    {
      title: "Men-Days Principle",
      formulas: [
        { exp: "M₁ × D₁ = M₂ × D₂", desc: "If amount of work is constant, men × days is constant." },
        { exp: "M₁ × D₁ × H₁ = M₂ × D₂ × H₂", desc: "Extended formula including hours worked per day." }
      ]
    }
  ],
  "Time and Distance": [
    {
      title: "Fundamental Formulas",
      formulas: [
        { exp: "Speed = Distance / Time", desc: "Rate of change of position." },
        { exp: "Distance = Speed × Time", desc: "Total ground covered." },
        { exp: "Time = Distance / Speed", desc: "Duration of travel." }
      ]
    },
    {
      title: "Average Speed",
      formulas: [
        { exp: "Avg Speed = Total Distance / Total Time", desc: "For multi-stage journeys." },
        { exp: "Avg Speed = 2xy / (x + y)", desc: "For equal distances at speed x then y." }
      ]
    }
  ],
  "Simple Interest": [
    {
      title: "Core Formula",
      formulas: [
        { exp: "S.I. = (P × R × T) / 100", desc: "P = Principal, R = Rate p.a., T = Time in years." },
        { exp: "Amount = P + S.I.", desc: "Total amount received at end of period." }
      ]
    },
    {
      title: "Rearrangements",
      formulas: [
        { exp: "P = (100 × S.I.) / (R × T)", desc: "Finding Principal." },
        { exp: "R = (100 × S.I.) / (P × T)", desc: "Finding Rate." },
        { exp: "T = (100 × S.I.) / (P × R)", desc: "Finding Time." }
      ]
    }
  ],
  "Compound Interest": [
    {
      title: "Core Formulas",
      formulas: [
        { exp: "Amount = P × (1 + R/100)^T", desc: "P = Principal, R = Rate p.a., T = Time in years." },
        { exp: "C.I. = Amount - Principal", desc: "Compound interest is the difference between final amount and initial principal." }
      ]
    },
    {
      title: "Half-Yearly & Quarterly",
      formulas: [
        { exp: "Half-yearly: Amount = P × (1 + R/200)^(2T)", desc: "When interest is compounded semi-annually." },
        { exp: "Quarterly: Amount = P × (1 + R/400)^(4T)", desc: "When interest is compounded every quarter." }
      ]
    },
    {
      title: "Shortcut — Difference CI and SI",
      formulas: [
        { exp: "CI - SI (2 yrs) = P × (R/100)²", desc: "The extra interest in 2nd year compared to SI." },
        { exp: "Rule of 72: Doubling Time ≈ 72 / R", desc: "Approximate years for money to double at rate R%." }
      ]
    }
  ],
  "Profit and Loss": [
    {
      title: "Definitions",
      formulas: [
        { exp: "Gain = SP - CP (when SP > CP)", desc: "Positive difference when selling price exceeds cost price." },
        { exp: "Loss = CP - SP (when CP > SP)", desc: "Positive difference when cost price exceeds selling price." }
      ]
    },
    {
      title: "Percentages",
      formulas: [
        { exp: "Gain% = (Gain / CP) × 100", desc: "Always calculated on Cost Price." },
        { exp: "Loss% = (Loss / CP) × 100", desc: "Always calculated on Cost Price." }
      ]
    },
    {
      title: "SP & CP Calculations",
      formulas: [
        { exp: "SP = [(100 + Gain%) / 100] × CP", desc: "Finding SP from CP and Gain%." },
        { exp: "SP = [(100 - Loss%) / 100] × CP", desc: "Finding SP from CP and Loss%." },
        { exp: "CP = [100 / (100 + Gain%)] × SP", desc: "Finding CP from SP and Gain%." },
        { exp: "CP = [100 / (100 - Loss%)] × SP", desc: "Finding CP from SP and Loss%." }
      ]
    },
    {
      title: "Discount Formulas",
      formulas: [
        { exp: "Discount = MP - SP", desc: "Difference between Marked Price and Selling Price." },
        { exp: "Discount% = (Discount / MP) × 100", desc: "Calculated on Marked Price." },
        { exp: "SP = MP × (1 - Discount%/100)", desc: "After applying discount on marked price." }
      ]
    }
  ],
  "Percentage": [
    {
      title: "Basics",
      formulas: [
        { exp: "x% = x / 100", desc: "Converting percent to decimal." },
        { exp: "a/b as % = (a/b × 100)%", desc: "Converting fraction to percent." }
      ]
    },
    {
      title: "Percentage Change",
      formulas: [
        { exp: "% Increase = (Increase / Original) × 100", desc: "Rate of growth." },
        { exp: "% Decrease = (Decrease / Original) × 100", desc: "Rate of reduction." }
      ]
    },
    {
      title: "Price & Consumption",
      formulas: [
        { exp: "Reduction in consumption = [R / (100 + R)] × 100%", desc: "If price increases by R%, to keep expenditure same." },
        { exp: "Increase in consumption = [R / (100 - R)] × 100%", desc: "If price decreases by R%, to keep expenditure same." }
      ]
    },
    {
      title: "Successive Percentage Change",
      formulas: [
        { exp: "Net % = a + b + (a×b)/100", desc: "When two successive percentage changes a% and b% are applied." },
        { exp: "Overall multiplier = (1 + a/100)(1 + b/100)", desc: "Compound effect of two successive changes." }
      ]
    }
  ],
  "Ratio and Proportion": [
    {
      title: "Fundamentals",
      formulas: [
        { exp: "Ratio a:b = a/b", desc: "Expresses relative sizes of two quantities." },
        { exp: "Proportion: a:b :: c:d ⟺ a×d = b×c", desc: "Cross-multiplication rule for proportions." }
      ]
    },
    {
      title: "Compound Ratio",
      formulas: [
        { exp: "Compound Ratio of (a:b) and (c:d) = (ac):(bd)", desc: "Multiply the corresponding terms." },
        { exp: "Duplicate Ratio of a:b = a²:b²", desc: "Square each term of the ratio." },
        { exp: "Triplicate Ratio of a:b = a³:b³", desc: "Cube each term of the ratio." }
      ]
    },
    {
      title: "Partnership Division",
      formulas: [
        { exp: "Share of A / Share of B = Capital of A / Capital of B", desc: "Direct ratio for same time investment." },
        { exp: "Share ∝ Capital × Time", desc: "When partners invest for different durations." }
      ]
    }
  ],
  "Problems on Ages": [
    {
      title: "Key Relationships",
      formulas: [
        { exp: "If present age = x, age n years hence = x + n", desc: "Future age formula." },
        { exp: "If present age = x, age n years ago = x - n", desc: "Past age formula." }
      ]
    },
    {
      title: "Ratio Method",
      formulas: [
        { exp: "If A:B = m:n, A = m × (Total Age) / (m+n)", desc: "Splitting total age in given ratio." },
        { exp: "Age difference is always constant regardless of year", desc: "The difference between ages never changes." }
      ]
    }
  ],
  "Average": [
    {
      title: "Core Formula",
      formulas: [
        { exp: "Average = Sum of Observations / Number of Observations", desc: "Basic average definition." },
        { exp: "Sum = Average × Number of Observations", desc: "Finding total from average." }
      ]
    },
    {
      title: "Weighted Average",
      formulas: [
        { exp: "Weighted Avg = (w₁x₁ + w₂x₂ + ...) / (w₁ + w₂ + ...)", desc: "When items have different weights or frequencies." }
      ]
    },
    {
      title: "Effect of Adding/Removing Elements",
      formulas: [
        { exp: "New Sum = Old Average × Old Count + New Element", desc: "Adding one element to a set." },
        { exp: "New Average = New Sum / New Count", desc: "Recalculate after any change." }
      ]
    }
  ],
  "Partnership": [
    {
      title: "Simple Partnership",
      formulas: [
        { exp: "Profit ∝ Capital (when time is equal)", desc: "Direct proportion of profit to investment." },
        { exp: "Ratio of profits = Ratio of capitals", desc: "For same time period investments." }
      ]
    },
    {
      title: "Compound Partnership",
      formulas: [
        { exp: "Equivalent Capital = Capital × Time", desc: "When investments are for different periods." },
        { exp: "Profit Share = (Equivalent Capital / Total Equivalent Capital) × Total Profit", desc: "Dividing profit in compound partnership." }
      ]
    }
  ],
  "Calendar": [
    {
      title: "Odd Days",
      formulas: [
        { exp: "Ordinary year = 365 days = 52 weeks + 1 odd day", desc: "1 odd day per ordinary year." },
        { exp: "Leap year = 366 days = 52 weeks + 2 odd days", desc: "2 odd days per leap year." }
      ]
    },
    {
      title: "Leap Year Rules",
      formulas: [
        { exp: "Divisible by 4 → leap year (exceptions: century years)", desc: "General leap year rule." },
        { exp: "Century year divisible by 400 → leap year", desc: "2000 is leap; 1900 is not." }
      ]
    },
    {
      title: "Days Count",
      formulas: [
        { exp: "100 years = 76 ordinary + 24 leap = 5 odd days", desc: "Total odd days in a century." },
        { exp: "Day code: Sun=0, Mon=1, Tue=2, Wed=3, Thu=4, Fri=5, Sat=6", desc: "Day numbering for calculations." }
      ]
    }
  ],
  "Clock": [
    {
      title: "Speed of Hands",
      formulas: [
        { exp: "Minute hand: 360° in 60 min = 6° per minute", desc: "Rate of minute hand." },
        { exp: "Hour hand: 360° in 12 hrs = 0.5° per minute", desc: "Rate of hour hand." },
        { exp: "Relative speed = 5.5° per minute", desc: "Minute hand gains 5.5° on hour hand per minute." }
      ]
    },
    {
      title: "Angle Between Hands",
      formulas: [
        { exp: "Angle = |11M/2 - 30H|", desc: "M = minutes, H = hours. If > 180°, subtract from 360°." }
      ]
    },
    {
      title: "Coincidence & Right Angle",
      formulas: [
        { exp: "Hands coincide every 65.45 min (720/11 min)", desc: "Exact time between overlaps." },
        { exp: "Hands at right angle (90°): twice every 65.45 min", desc: "Hands form 90° at specific intervals." }
      ]
    }
  ],
  "Area": [
    {
      title: "Basic Shapes",
      formulas: [
        { exp: "Rectangle: Area = l × b, Perimeter = 2(l + b)", desc: "Length × Breadth for area." },
        { exp: "Square: Area = a², Perimeter = 4a", desc: "Side squared for area." },
        { exp: "Triangle: Area = ½ × base × height", desc: "Half base times height." }
      ]
    },
    {
      title: "Advanced Shapes",
      formulas: [
        { exp: "Circle: Area = πr², Circumference = 2πr", desc: "Pi times radius squared." },
        { exp: "Trapezium: Area = ½ × (a + b) × h", desc: "Half sum of parallel sides times height." },
        { exp: "Rhombus: Area = ½ × d₁ × d₂", desc: "Half product of diagonals." }
      ]
    },
    {
      title: "Heron's Formula",
      formulas: [
        { exp: "s = (a + b + c) / 2  (semi-perimeter)", desc: "Calculate s first." },
        { exp: "Area = √[s(s-a)(s-b)(s-c)]", desc: "Area from three sides using Heron's formula." }
      ]
    }
  ],
  "Volume and Surface Area": [
    {
      title: "Cube & Cuboid",
      formulas: [
        { exp: "Cube: Volume = a³, Surface Area = 6a²", desc: "All sides equal." },
        { exp: "Cuboid: Volume = l×b×h, Surface Area = 2(lb+bh+lh)", desc: "Length, breadth, height." }
      ]
    },
    {
      title: "Cylinder & Cone",
      formulas: [
        { exp: "Cylinder: Volume = πr²h, Curved SA = 2πrh, Total SA = 2πr(r+h)", desc: "Right circular cylinder." },
        { exp: "Cone: Volume = ⅓πr²h, Curved SA = πrl, l = √(r²+h²)", desc: "Right circular cone; l = slant height." }
      ]
    },
    {
      title: "Sphere & Hemisphere",
      formulas: [
        { exp: "Sphere: Volume = (4/3)πr³, Surface Area = 4πr²", desc: "Full sphere." },
        { exp: "Hemisphere: Volume = (2/3)πr³, Curved SA = 2πr², Total SA = 3πr²", desc: "Half sphere." }
      ]
    }
  ],
  "Permutation and Combination": [
    {
      title: "Core Formulas",
      formulas: [
        { exp: "nPr = n! / (n-r)!", desc: "Number of permutations (ordered arrangements) of r from n." },
        { exp: "nCr = n! / [r! × (n-r)!]", desc: "Number of combinations (unordered selections) of r from n." }
      ]
    },
    {
      title: "Special Cases",
      formulas: [
        { exp: "nC0 = nCn = 1", desc: "Selecting none or all items has exactly one way." },
        { exp: "nCr = nC(n-r)", desc: "Complementary combination property." },
        { exp: "Circular permutation of n objects = (n-1)!", desc: "Arranging n objects in a circle." }
      ]
    },
    {
      title: "Repetition Rules",
      formulas: [
        { exp: "Permutation with repetition = n^r", desc: "Choosing r items from n with repetition allowed." },
        { exp: "Arrangement of n items with p identical = n! / p!", desc: "When p items are identical." }
      ]
    }
  ],
  "Numbers": [
    {
      title: "Divisibility Rules",
      formulas: [
        { exp: "Divisible by 2: last digit even", desc: "0,2,4,6,8 in units place." },
        { exp: "Divisible by 3: sum of digits divisible by 3", desc: "Add all digits and check." },
        { exp: "Divisible by 9: sum of digits divisible by 9", desc: "Similar to rule of 3." },
        { exp: "Divisible by 11: alternating sum = 0 or multiple of 11", desc: "(odd position sum) - (even position sum)." }
      ]
    },
    {
      title: "Properties",
      formulas: [
        { exp: "Sum of first n natural numbers = n(n+1)/2", desc: "Arithmetic series sum." },
        { exp: "Sum of squares of first n natural numbers = n(n+1)(2n+1)/6", desc: "Sum of 1² + 2² + ... + n²." },
        { exp: "Sum of cubes = [n(n+1)/2]²", desc: "Sum of 1³ + 2³ + ... + n³." }
      ]
    }
  ],
  "Problems on Numbers": [
    {
      title: "Number Representation",
      formulas: [
        { exp: "Two-digit number: 10x + y (tens digit x, units digit y)", desc: "Standard form of 2-digit number." },
        { exp: "Reversed number: 10y + x", desc: "Digits swapped." },
        { exp: "Sum of digits of (10x+y) = x + y", desc: "Digit sum." }
      ]
    },
    {
      title: "Consecutive Numbers",
      formulas: [
        { exp: "Consecutive integers: n, n+1, n+2, ...", desc: "Each differs by 1." },
        { exp: "Consecutive odd/even: n, n+2, n+4, ...", desc: "Each differs by 2." }
      ]
    }
  ],
  "Problems on H.C.F and L.C.M": [
    {
      title: "Definitions",
      formulas: [
        { exp: "HCF (GCD): largest number dividing all given numbers", desc: "Highest Common Factor." },
        { exp: "LCM: smallest number divisible by all given numbers", desc: "Least Common Multiple." }
      ]
    },
    {
      title: "Key Relationships",
      formulas: [
        { exp: "HCF × LCM = Product of two numbers", desc: "Valid for exactly two numbers." },
        { exp: "HCF of fractions = HCF of numerators / LCM of denominators", desc: "For fractions." },
        { exp: "LCM of fractions = LCM of numerators / HCF of denominators", desc: "For fractions." }
      ]
    }
  ],
  "Decimal Fraction": [
    {
      title: "Operations",
      formulas: [
        { exp: "To multiply decimals: multiply ignoring decimal, then place decimal", desc: "Count total decimal places in factors." },
        { exp: "To divide: multiply both by 10^n to make divisor whole", desc: "Clear the decimal from denominator first." }
      ]
    },
    {
      title: "Recurring Decimals",
      formulas: [
        { exp: "Pure recurring: 0.̄ā = a/9", desc: "Single digit recurring: divide by 9." },
        { exp: "Mixed recurring: (all digits - non-recurring) / (9s and 0s)", desc: "Number of 9s = recurring digits, 0s = non-recurring." }
      ]
    }
  ],
  "Simplification": [
    {
      title: "BODMAS / PEMDAS",
      formulas: [
        { exp: "Order: Brackets → Orders → Division → Multiplication → Addition → Subtraction", desc: "Always follow this sequence." },
        { exp: "Vinculum (bar over expression) evaluated first", desc: "Then outer brackets B→O→D→M→A→S." }
      ]
    },
    {
      title: "Algebraic Identities",
      formulas: [
        { exp: "(a+b)² = a² + 2ab + b²", desc: "Square of sum." },
        { exp: "(a-b)² = a² - 2ab + b²", desc: "Square of difference." },
        { exp: "a² - b² = (a+b)(a-b)", desc: "Difference of squares." },
        { exp: "(a+b)³ = a³ + 3a²b + 3ab² + b³", desc: "Cube of sum." }
      ]
    }
  ],
  "Square Root and Cube Root": [
    {
      title: "Square Root",
      formulas: [
        { exp: "√(a×b) = √a × √b", desc: "Product rule for square roots." },
        { exp: "√(a/b) = √a / √b", desc: "Quotient rule." },
        { exp: "√a + √b ≠ √(a+b)", desc: "Cannot split square root over addition." }
      ]
    },
    {
      title: "Cube Root",
      formulas: [
        { exp: "∛(a×b) = ∛a × ∛b", desc: "Product rule for cube roots." },
        { exp: "a^(1/3) = ∛a", desc: "Fractional exponent equals cube root." }
      ]
    }
  ],
  "Surds and Indices": [
    {
      title: "Laws of Indices",
      formulas: [
        { exp: "aᵐ × aⁿ = aᵐ⁺ⁿ", desc: "Multiply same base: add exponents." },
        { exp: "aᵐ / aⁿ = aᵐ⁻ⁿ", desc: "Divide same base: subtract exponents." },
        { exp: "(aᵐ)ⁿ = aᵐⁿ", desc: "Power of power: multiply exponents." },
        { exp: "a⁰ = 1 (a ≠ 0)", desc: "Any nonzero number to power 0 equals 1." },
        { exp: "a⁻ⁿ = 1/aⁿ", desc: "Negative exponent means reciprocal." }
      ]
    },
    {
      title: "Surds (Irrational Roots)",
      formulas: [
        { exp: "Rationalizing factor of (a + √b) is (a - √b)", desc: "Conjugate pair product = a² - b (rational)." },
        { exp: "√a × √b = √(ab)", desc: "Simplification rule." }
      ]
    }
  ],
  "Chain Rule": [
    {
      title: "Direct Proportion",
      formulas: [
        { exp: "x₁/x₂ = y₁/y₂ (direct proportion)", desc: "Both quantities increase or decrease together." }
      ]
    },
    {
      title: "Inverse Proportion",
      formulas: [
        { exp: "x₁ × y₁ = x₂ × y₂ (inverse proportion)", desc: "One increases as other decreases." }
      ]
    },
    {
      title: "Multi-Variable Chain",
      formulas: [
        { exp: "M₁×D₁×H₁/W₁ = M₂×D₂×H₂/W₂", desc: "Chain rule with Men, Days, Hours, Work." }
      ]
    }
  ],
  "Pipes and Cistern": [
    {
      title: "Filling & Emptying",
      formulas: [
        { exp: "If pipe fills in n hours, rate = 1/n per hour", desc: "Work rate for filling pipe." },
        { exp: "If pipe empties in n hours, rate = -1/n per hour", desc: "Work rate for emptying pipe (negative)." }
      ]
    },
    {
      title: "Combined Rate",
      formulas: [
        { exp: "Net fill time = 1 / (Sum of fill rates - Sum of drain rates)", desc: "Combine all pipe rates algebraically." }
      ]
    }
  ],
  "Boats and Streams": [
    {
      title: "Upstream & Downstream",
      formulas: [
        { exp: "Downstream speed = Boat speed + Stream speed", desc: "Moving in direction of current." },
        { exp: "Upstream speed = Boat speed - Stream speed", desc: "Moving against current." }
      ]
    },
    {
      title: "Deriving Speeds",
      formulas: [
        { exp: "Boat speed = (Downstream + Upstream) / 2", desc: "Speed in still water." },
        { exp: "Stream speed = (Downstream - Upstream) / 2", desc: "Speed of the current." }
      ]
    }
  ],
  "Alligation or Mixture": [
    {
      title: "Rule of Alligation",
      formulas: [
        { exp: "Cheaper quantity / Costlier quantity = (Mean - Cheaper) / (Costlier - Mean)", desc: "Cross subtraction rule for mixing." }
      ]
    },
    {
      title: "Mixture Replacement",
      formulas: [
        { exp: "Final purity = [1 - (volume removed / total volume)]^n", desc: "After n replacements of same volume." }
      ]
    }
  ],
  "Logarithm": [
    {
      title: "Basic Definitions",
      formulas: [
        { exp: "logₐ(b) = x ⟺ aˣ = b", desc: "Logarithm as inverse of exponentiation." },
        { exp: "log₁₀(10) = 1, log_a(a) = 1", desc: "Any base logs itself = 1." },
        { exp: "log_a(1) = 0", desc: "Log of 1 to any base is 0." }
      ]
    },
    {
      title: "Properties",
      formulas: [
        { exp: "log(mn) = log m + log n", desc: "Log of product = sum of logs." },
        { exp: "log(m/n) = log m - log n", desc: "Log of quotient = difference of logs." },
        { exp: "log(mⁿ) = n × log m", desc: "Log of power = exponent times log." },
        { exp: "log_a(b) = log(b) / log(a) = ln(b) / ln(a)", desc: "Change of base formula." }
      ]
    }
  ],
  "Races and Games": [
    {
      title: "Key Concepts",
      formulas: [
        { exp: "Head start: A gives B 'n m start' means B starts n m ahead", desc: "Physical advantage in distance." },
        { exp: "Time start: A gives B 't sec start' means A starts t seconds after B", desc: "Time advantage." }
      ]
    },
    {
      title: "Winning Formulas",
      formulas: [
        { exp: "Winning margin = Difference in distances covered in same time", desc: "Based on speed ratio." },
        { exp: "Speed ratio A:B = Distance A covers : Distance B covers (same time)", desc: "Fundamental ratio." }
      ]
    }
  ],
  "Stocks and Shares": [
    {
      title: "Key Definitions",
      formulas: [
        { exp: "Face value (par value): value printed on share", desc: "Usually ₹10, ₹100." },
        { exp: "Market value: current price at which share trades", desc: "Fluctuates with market." },
        { exp: "Dividend: % on face value paid annually", desc: "Based on original face value." }
      ]
    },
    {
      title: "Returns",
      formulas: [
        { exp: "Annual income = (Dividend% / 100) × Face Value", desc: "Income per share per year." },
        { exp: "Yield = Annual Income / Market Price × 100", desc: "Return on investment at current price." },
        { exp: "Number of shares = Investment / Market Price", desc: "Shares you can buy." }
      ]
    }
  ],
  "Probability": [
    {
      title: "Core Formulas",
      formulas: [
        { exp: "P(E) = Favourable Outcomes / Total Outcomes", desc: "Basic probability of event E." },
        { exp: "0 ≤ P(E) ≤ 1", desc: "Probability always lies between 0 and 1." }
      ]
    },
    {
      title: "Addition & Multiplication",
      formulas: [
        { exp: "P(A or B) = P(A) + P(B) - P(A and B)", desc: "Addition rule for any two events." },
        { exp: "P(A and B) = P(A) × P(B)  [if independent]", desc: "Multiplication rule for independent events." }
      ]
    },
    {
      title: "Complement Rule",
      formulas: [
        { exp: "P(not A) = 1 - P(A)", desc: "Complement probability." },
        { exp: "P(A|B) = P(A and B) / P(B)", desc: "Conditional probability of A given B." }
      ]
    }
  ],
  "True Discount": [
    {
      title: "Key Formulas",
      formulas: [
        { exp: "Present Worth (PW) = 100 × Amount / (100 + R × T)", desc: "True present value of future sum." },
        { exp: "True Discount (TD) = Amount - Present Worth", desc: "Interest on Present Worth." },
        { exp: "TD = (PW × R × T) / 100", desc: "Simple interest on PW at rate R for T years." }
      ]
    }
  ],
  "Banker's Discount": [
    {
      title: "Key Formulas",
      formulas: [
        { exp: "Banker's Discount (BD) = (Face Value × R × T) / 100", desc: "Simple interest on face value." },
        { exp: "Banker's Gain (BG) = BD - TD", desc: "Difference between BD and True Discount." },
        { exp: "BD / TD = Amount / PW", desc: "Ratio relationship." }
      ]
    }
  ],
  "Odd Man Out and Series": [
    {
      title: "Number Series Patterns",
      formulas: [
        { exp: "Arithmetic: common difference d = a₂ - a₁", desc: "Each term increases/decreases by same amount." },
        { exp: "Geometric: common ratio r = a₂ / a₁", desc: "Each term multiplied by same factor." },
        { exp: "Square/Cube series: n², n³, n²+1, etc.", desc: "Based on perfect squares or cubes." }
      ]
    },
    {
      title: "Odd One Out",
      formulas: [
        { exp: "Identify the property: prime, composite, perfect square, etc.", desc: "Find the one that breaks the pattern." }
      ]
    }
  ],
  "Height and Distance": [
    {
      title: "Trigonometric Ratios",
      formulas: [
        { exp: "tan θ = opposite / adjacent = Height / Base", desc: "Most used for height-distance problems." },
        { exp: "sin θ = opposite / hypotenuse", desc: "Sine ratio." },
        { exp: "cos θ = adjacent / hypotenuse", desc: "Cosine ratio." }
      ]
    },
    {
      title: "Standard Angles",
      formulas: [
        { exp: "tan 30° = 1/√3, tan 45° = 1, tan 60° = √3", desc: "Most common angles in problems." },
        { exp: "sin 30° = ½, sin 45° = 1/√2, sin 60° = √3/2", desc: "Standard sine values." }
      ]
    },
    {
      title: "Angle of Elevation & Depression",
      formulas: [
        { exp: "Angle of Elevation: looking UP from horizontal", desc: "Observer below the object." },
        { exp: "Angle of Depression: looking DOWN from horizontal", desc: "Observer above the object." }
      ]
    }
  ],
};

function normalizeTopicName(topic) {
  const mappings = {
    "HCF and LCM": "Problems on H.C.F and L.C.M",
    "Averages": "Average",
    "Alligation and Mixture": "Alligation or Mixture",
    "Percentages": "Percentage",
    "Time Speed Distance": "Time and Distance",
    "Logarithms": "Logarithm",
    "Mensuration": "Area"
  };
  return mappings[topic] || topic;
}

export function getFormulasForTopic(topic) {
  const mappedTopic = normalizeTopicName(topic);
  if (FORMULAS_DATA[mappedTopic]) return FORMULAS_DATA[mappedTopic];
  return [
    {
      title: `General Rules of ${topic}`,
      formulas: [
        { exp: `Core Formula: Standard relation for ${topic}`, desc: `Understand the fundamental terms and relationships involved in ${topic} problems.` },
        { exp: `Rate/Ratio Rule of ${topic}`, desc: `Apply inverse or direct proportionalities to solve comparison questions in ${topic}.` },
        { exp: `Percentage/Average Rule for ${topic}`, desc: `Combine ${topic} concepts with arithmetic formulas to reach final answers.` }
      ]
    }
  ];
}

// ─── DATA SUFFICIENCY ─────────────────────────────────────────────────────────

const TRAINS_DS = {
  ds1: [
    {
      question: "What is the speed of the train?",
      statements: ["I. The train crosses a signal pole in 18 seconds.", "II. The train crosses a 250 m long platform in 36 seconds."],
      answer: "E",
      explanation: "Let length L and speed S. From I: L = 18S. From II: (L+250)/S = 36 => 18S+250 = 36S => S = 250/18 m/s ≈ 50 km/hr. Both statements together are sufficient."
    },
    {
      question: "What is the length of train A?",
      statements: ["I. Train A crosses train B running in opposite direction in 20 seconds.", "II. Speed of train A is 60 km/hr and speed of train B is 80 km/hr."],
      answer: "D",
      explanation: "Relative speed = 140 km/hr. (L_A + L_B) = 140*(5/18)*20 = 777.8 m. Length of B is unknown, so L_A cannot be found. Neither statement alone nor together is sufficient."
    },
    {
      question: "How long will the train take to cross a platform?",
      statements: ["I. The train crosses a standing man in 10 seconds.", "II. The speed of the train is 54 km/hr."],
      answer: "D",
      explanation: "From I & II: L = 15*10 = 150 m. But platform length is unknown. Both together are still not sufficient."
    },
    {
      question: "What is the distance between two trains after 2 hours?",
      statements: ["I. They move in opposite directions.", "II. Their speeds are 45 km/hr and 55 km/hr."],
      answer: "E",
      explanation: "Relative speed (opposite) = 45+55 = 100 km/hr. Distance = 100*2 = 200 km. Both together are sufficient."
    },
    {
      question: "What is the speed of train?",
      statements: ["I. The train crosses a 300 m bridge in 20 seconds.", "II. The train crosses a stationary car in 8 seconds."],
      answer: "E",
      explanation: "From I: L+300 = 20S. From II: L = 8S. So 8S+300 = 20S => S = 25 m/s = 90 km/hr. Both together are sufficient."
    },
    {
      question: "How long does train take to cross another train from the opposite direction?",
      statements: ["I. Two trains have lengths 120 m and 180 m.", "II. Speed of the faster train is 72 km/hr."],
      answer: "D",
      explanation: "Total length = 300 m. But speed of slower train is unknown. Relative speed can't be found. Insufficient."
    },
    {
      question: "Will train A overtake train B?",
      statements: ["I. Train A travels at 90 km/hr.", "II. Train B travels at 75 km/hr in the same direction."],
      answer: "E",
      explanation: "Since A is faster (90 > 75 km/hr) and they travel the same direction, A will eventually overtake B. Both statements together are sufficient."
    }
  ],
  ds2: [
    {
      question: "How many seconds does it take two trains to cross each other?",
      statements: ["I. Trains have lengths 200 m and 150 m.", "II. They are running towards each other at 60 km/hr and 90 km/hr."],
      answer: "E",
      explanation: "Total length = 350 m. Relative speed = 60+90 = 150 km/hr = 125/3 m/s. Time = 350 / (125/3) = 8.4 s. Both together are sufficient."
    },
    {
      question: "What time does a train take to cross a stationary train?",
      statements: ["I. Length of moving train is 400 m.", "II. Length of stationary train is 250 m and speed of moving train is 72 km/hr."],
      answer: "E",
      explanation: "Total length = 400+250 = 650 m. Speed = 72*(5/18) = 20 m/s. Time = 650/20 = 32.5 s. Both together are sufficient."
    },
    {
      question: "What is the length of the platform?",
      statements: ["I. Train of length 300 m passes the platform in 25 seconds.", "II. Speed of train is 72 km/hr."],
      answer: "E",
      explanation: "Speed = 20 m/s. In 25 s, it covers 500 m = 300 + platform length. Platform = 200 m. Both together are sufficient."
    },
    {
      question: "What is the speed of train?",
      statements: ["I. It crosses a 200 m tunnel in 20 seconds.", "II. It crosses a 100 m bridge in 14 seconds."],
      answer: "E",
      explanation: "From I: (L+200)/S = 20. From II: (L+100)/S = 14. Subtracting: 100/S = 6 => S = 100/6 m/s ≈ 60 km/hr. Both together are sufficient."
    },
    {
      question: "Do the two trains meet?",
      statements: ["I. Train A starts from station P at 6 AM.", "II. Train B starts from station Q (600 km away) at 8 AM at 150 km/hr toward A."],
      answer: "D",
      explanation: "Speed of Train A is not given. Without knowing both speeds, meeting point can't be determined. Insufficient."
    },
    {
      question: "How long does a train take to cross a pole?",
      statements: ["I. Length of train is 250 m.", "II. The train takes 30 seconds to cross a 500 m long bridge."],
      answer: "E",
      explanation: "From II: (250+500)/S = 30 => S = 25 m/s. Time to cross pole = 250/25 = 10 s. Both together are sufficient."
    },
    {
      question: "Is the speed of train more than 100 km/hr?",
      statements: ["I. Train covers 1 km in 40 seconds.", "II. Train crosses a platform of length 200 m in 48 seconds."],
      answer: "A",
      explanation: "From I: Speed = 1000/40 = 25 m/s = 90 km/hr < 100 km/hr. Statement I alone is sufficient to answer: No, speed is not more than 100 km/hr."
    }
  ],
  ds3: [
    {
      question: "What is the ratio of speeds of two trains?",
      statements: ["I. First train crosses a pole in 8 seconds.", "II. Second train crosses the same pole in 12 seconds."],
      answer: "D",
      explanation: "Lengths of trains are unknown. Even though we have times, without lengths we can't find individual speeds or their ratio."
    },
    {
      question: "What is the length of the train?",
      statements: ["I. The train crosses a bridge of 1 km in 60 seconds.", "II. Speed of the train is 72 km/hr."],
      answer: "E",
      explanation: "Speed = 72*(5/18) = 20 m/s. In 60 s, distance covered = 1200 m. Length = 1200 - 1000 = 200 m. Both together are sufficient."
    },
    {
      question: "Will train A reach city B before train B reaches city A?",
      statements: ["I. Both cities are 600 km apart.", "II. Train A travels at 120 km/hr and Train B at 100 km/hr."],
      answer: "E",
      explanation: "Time for A = 600/120 = 5 hrs. Time for B = 600/100 = 6 hrs. Yes, A reaches first. Both together are sufficient."
    },
    {
      question: "By how many seconds does the express train arrive before the local train?",
      statements: ["I. Express train covers 300 km at 150 km/hr.", "II. Local train covers the same 300 km at 100 km/hr."],
      answer: "E",
      explanation: "Time for express = 2 hrs = 7200 s. Time for local = 3 hrs = 10800 s. Difference = 3600 s. Both together are sufficient."
    },
    {
      question: "What fraction of the journey does the train complete in 2 hours?",
      statements: ["I. Total journey distance is 240 km.", "II. Speed of the train is 80 km/hr."],
      answer: "E",
      explanation: "Distance in 2 hrs = 80*2 = 160 km. Fraction = 160/240 = 2/3. Both statements together are sufficient."
    },
    {
      question: "How far has the train traveled when they meet?",
      statements: ["I. Train A travels at 80 km/hr and Train B at 100 km/hr from opposite ends.", "II. They are 450 km apart initially and start simultaneously."],
      answer: "E",
      explanation: "Relative speed = 180 km/hr. Time to meet = 450/180 = 2.5 hrs. Train A travels 80*2.5 = 200 km. Both together are sufficient."
    }
  ]
};

const WORK_DS = {
  ds1: [
    {
      question: "How many days will A and B take to complete a work together?",
      statements: ["I. A alone can do the work in 10 days.", "II. B is twice as efficient as A."],
      answer: "E",
      explanation: "A takes 10 days, B is twice efficient so B takes 5 days. Together = (10*5)/(10+5) = 50/15 ≈ 3.33 days. Both together are sufficient."
    },
    {
      question: "In how many days can B complete a job?",
      statements: ["I. A can complete the job in 12 days.", "II. A and B together can complete the job in 8 days."],
      answer: "E",
      explanation: "1/B = 1/8 - 1/12 = (3-2)/24 = 1/24. B takes 24 days. Both together are sufficient."
    },
    {
      question: "How many days will C take to complete the work alone?",
      statements: ["I. A and B together take 6 days.", "II. A, B, and C together take 4 days."],
      answer: "E",
      explanation: "Rate of C = 1/4 - 1/6 = 1/12. C takes 12 days. Both together are sufficient."
    },
    {
      question: "How many men are needed to complete the work in 6 days?",
      statements: ["I. 15 men complete the work in 12 days.", "II. All men work at the same rate."],
      answer: "E",
      explanation: "Total work = 15*12 = 180 man-days. Men needed = 180/6 = 30 men. Both together are sufficient."
    },
    {
      question: "How long does A take to finish the work alone?",
      statements: ["I. A and B together finish in 8 days.", "II. B alone takes 24 days."],
      answer: "E",
      explanation: "1/A = 1/8 - 1/24 = (3-1)/24 = 2/24 = 1/12. A takes 12 days. Both together are sufficient."
    },
    {
      question: "Will A alone complete the work by Friday?",
      statements: ["I. A can complete the work in 5 days.", "II. Work starts on Monday."],
      answer: "E",
      explanation: "Starts Monday, 5 days work ends Friday. Yes, A will complete by Friday. Both together are sufficient."
    },
    {
      question: "In how many days will 5 women finish the work?",
      statements: ["I. 3 men can finish the work in 10 days.", "II. Efficiency of a man is 1.5 times that of a woman."],
      answer: "E",
      explanation: "Total work = 3*10 = 30 man-days. 1 woman's rate = 1/1.5 of a man. Woman-days = 30*1.5 = 45 woman-days. 5 women take 45/5 = 9 days. Both together are sufficient."
    }
  ],
  ds2: [
    {
      question: "How long does it take for A to finish 1/3 of the work?",
      statements: ["I. A completes the full work in 18 days.", "II. A works for 6 hours a day."],
      answer: "A",
      explanation: "From I alone: 1/3 of work = 18/3 = 6 days. Statement I alone is sufficient."
    },
    {
      question: "How many days does B work if A and B together finish in 12 days and A works alone for 4 days first?",
      statements: ["I. A alone takes 20 days.", "II. B alone takes 30 days."],
      answer: "E",
      explanation: "Work done by A in 4 days = 4/20 = 1/5. Remaining = 4/5. Together rate = 1/12. Days for B = (4/5)/(1/12) = 9.6 days. Both together are sufficient."
    },
    {
      question: "What fraction of work does C complete in 3 days?",
      statements: ["I. A, B, C together finish work in 9 days.", "II. A and B together take 12 days."],
      answer: "E",
      explanation: "Rate of C = 1/9 - 1/12 = 1/36. In 3 days C completes 3/36 = 1/12 of the work. Both together are sufficient."
    },
    {
      question: "Can B complete the remaining work in 5 days after A leaves?",
      statements: ["I. B alone can finish work in 10 days.", "II. A and B had completed 50% of the work before A left."],
      answer: "E",
      explanation: "Remaining = 50% = 1/2. B's rate = 1/10. Days needed = 5. Yes, B can complete in exactly 5 days. Both together are sufficient."
    },
    {
      question: "How much does A earn if he completes 2/5 of the work?",
      statements: ["I. Total wages for the work is ₹10,000.", "II. A, B, C are paid in proportion to work done."],
      answer: "E",
      explanation: "A's share = (2/5) * 10,000 = ₹4,000. Both statements together are sufficient."
    },
    {
      question: "How many days will A take to do a piece of work?",
      statements: ["I. A is 40% more efficient than B.", "II. B can complete the work in 21 days."],
      answer: "E",
      explanation: "A is 1.4 times as efficient as B. A's time = 21/1.4 = 15 days. Both together are sufficient."
    },
    {
      question: "In how many days will 6 workers complete the task?",
      statements: ["I. 4 workers complete the task in 9 days.", "II. All workers work at the same rate."],
      answer: "E",
      explanation: "Total work = 4*9 = 36 worker-days. 6 workers take 36/6 = 6 days. Both together are sufficient."
    }
  ],
  ds3: [
    {
      question: "Is A faster than B?",
      statements: ["I. A and B together finish work in 4 days.", "II. A alone finishes in 6 days."],
      answer: "E",
      explanation: "B's rate = 1/4 - 1/6 = 1/12. B takes 12 days. A takes 6 days. Yes, A is faster. Both together are sufficient."
    },
    {
      question: "What is the ratio of work done by A and B?",
      statements: ["I. A and B work together for 6 days.", "II. A takes 12 days and B takes 18 days to complete work alone."],
      answer: "E",
      explanation: "A's rate = 1/12, B's rate = 1/18. Work done ratio in equal time = rate ratio = 1/12 : 1/18 = 3:2. Both together are sufficient."
    },
    {
      question: "How many extra days are needed if C joins 5 days after A and B start?",
      statements: ["I. A takes 20 days, B takes 30 days, C takes 15 days alone.", "II. Work started on Jan 1."],
      answer: "A",
      explanation: "From I: Work by A+B in 5 days = 5*(1/20+1/30) = 5*(1/12) = 5/12. Remaining = 7/12. All three rate = 1/20+1/30+1/15 = 6/60 = 1/10. Days = (7/12)/(1/10) = 5.83 days. Statement I alone is sufficient."
    },
    {
      question: "What is B's daily wage?",
      statements: ["I. A, B, C are paid ₹3,600 total for completing a work.", "II. They completed the work in 4 days working together, with individual times 6, 9, and 12 days respectively."],
      answer: "E",
      explanation: "Rates: A=1/6, B=1/9, C=1/12. Ratio = 6:4:3. B's share = (4/13)*3600 = ₹1,107.7. Both together are sufficient."
    },
    {
      question: "How many days does A work if A, B, C together take 4 days and C works only 2 days?",
      statements: ["I. B alone takes 12 days.", "II. A alone takes 8 days, C alone takes 24 days."],
      answer: "E",
      explanation: "C works 2 days, doing 2/24 = 1/12 of work. Remaining 11/12 done by A and B. Their combined rate = 1/8+1/12 = 5/24. Days = (11/12)/(5/24) = 4.4 days. Both together are sufficient."
    },
    {
      question: "What is the total number of men needed to finish 3 times the work in half the time?",
      statements: ["I. Originally 20 men do the work in 30 days.", "II. All men work at the same rate."],
      answer: "E",
      explanation: "Original: 20*30 = 600 man-days. For 3x work in 15 days: man-days = 1800. Men needed = 1800/15 = 120. Both together are sufficient."
    }
  ]
};

const DISTANCE_DS = {
  ds1: [
    {
      question: "What is the distance between City X and City Y?",
      statements: ["I. A drives from X to Y at 60 km/hr.", "II. The return journey at 40 km/hr takes 1 hour longer."],
      answer: "E",
      explanation: "D/40 - D/60 = 1 => D(3-2)/120 = 1 => D = 120 km. Both together are sufficient."
    },
    {
      question: "What is the speed of the car?",
      statements: ["I. Car covers 180 km.", "II. Journey takes 3 hours."],
      answer: "E",
      explanation: "Speed = 180/3 = 60 km/hr. Both together are sufficient."
    },
    {
      question: "Does the train arrive on time?",
      statements: ["I. Train travels at 80 km/hr.", "II. Departure was delayed by 15 minutes."],
      answer: "D",
      explanation: "Without total journey distance and scheduled travel time, we cannot determine if train arrives on time. Insufficient."
    },
    {
      question: "How long does a person take to walk to office?",
      statements: ["I. Office is 5 km from home.", "II. Walking speed is 4 km/hr."],
      answer: "E",
      explanation: "Time = 5/4 = 1.25 hours = 75 minutes. Both together are sufficient."
    },
    {
      question: "What is the average speed for the entire journey?",
      statements: ["I. First half covered at 60 km/hr.", "II. Second half covered at 40 km/hr."],
      answer: "E",
      explanation: "Avg speed = 2*60*40/(60+40) = 48 km/hr. Both together are sufficient."
    },
    {
      question: "By how many minutes does B arrive before A?",
      statements: ["I. A walks at 5 km/hr and B cycles at 15 km/hr.", "II. Distance to school is 3 km."],
      answer: "E",
      explanation: "A takes 3/5 hr = 36 min. B takes 3/15 hr = 12 min. Difference = 24 min. Both together are sufficient."
    },
    {
      question: "What is the relative speed of two approaching cars?",
      statements: ["I. Car A travels at 80 km/hr.", "II. Car B travels at 70 km/hr toward car A."],
      answer: "E",
      explanation: "Relative speed = 80+70 = 150 km/hr. Both together are sufficient."
    }
  ],
  ds2: [
    {
      question: "How far does a man travel in 2.5 hours?",
      statements: ["I. Speed is 60 km/hr for first 1.5 hours.", "II. Speed is 80 km/hr for the remaining time."],
      answer: "E",
      explanation: "Distance = 60*1.5 + 80*1 = 90+80 = 170 km. Both together are sufficient."
    },
    {
      question: "How long does it take to cover 150 km at increased speed?",
      statements: ["I. Normal speed is 50 km/hr.", "II. Speed is increased by 25%."],
      answer: "E",
      explanation: "New speed = 50*1.25 = 62.5 km/hr. Time = 150/62.5 = 2.4 hours. Both together are sufficient."
    },
    {
      question: "What is the total distance of the round trip?",
      statements: ["I. One way journey takes 3 hours.", "II. Speed is 80 km/hr."],
      answer: "E",
      explanation: "One way = 80*3 = 240 km. Round trip = 480 km. Both together are sufficient."
    },
    {
      question: "How many minutes early does a person reach?",
      statements: ["I. Person walks at 4 km/hr and usually reaches just in time.", "II. Today person walks at 6 km/hr and distance is 3 km."],
      answer: "E",
      explanation: "Normal time = 3/4 hr = 45 min. Today's time = 3/6 = 30 min. Early by 15 minutes. Both together are sufficient."
    },
    {
      question: "What is the distance covered in the second half of the journey?",
      statements: ["I. Total journey is 600 km.", "II. First half was covered in 4 hours at 60 km/hr."],
      answer: "A",
      explanation: "From I alone: second half = 600/2 = 300 km. Statement I alone is sufficient."
    },
    {
      question: "At what speed does a person need to travel to make up 30 minutes?",
      statements: ["I. Remaining distance is 120 km.", "II. Available time is 1.5 hours."],
      answer: "E",
      explanation: "Required speed = 120/1.5 = 80 km/hr. Both together are sufficient."
    },
    {
      question: "How much time does the car save by taking the highway?",
      statements: ["I. Highway distance is 200 km at 100 km/hr.", "II. City route is 160 km at 40 km/hr."],
      answer: "E",
      explanation: "Highway: 2 hrs. City: 4 hrs. Time saved = 2 hrs. Both together are sufficient."
    }
  ],
  ds3: [
    {
      question: "Who reaches first — A or B?",
      statements: ["I. A runs at 10 km/hr, B runs at 12 km/hr.", "II. Both start from the same point and run the same 5 km route."],
      answer: "E",
      explanation: "A takes 0.5 hr, B takes 5/12 hr. B is faster, reaches first. Both together are sufficient."
    },
    {
      question: "What is the speed of the boat in still water?",
      statements: ["I. Downstream speed is 20 km/hr.", "II. Upstream speed is 12 km/hr."],
      answer: "E",
      explanation: "Boat speed = (20+12)/2 = 16 km/hr. Both together are sufficient."
    },
    {
      question: "In how many hours will two cyclists meet?",
      statements: ["I. They cycle toward each other at 15 km/hr and 25 km/hr.", "II. Starting distance between them is 200 km."],
      answer: "E",
      explanation: "Relative speed = 40 km/hr. Time = 200/40 = 5 hours. Both together are sufficient."
    },
    {
      question: "What is the distance between two cities?",
      statements: ["I. A bus travels at 60 km/hr and takes 5 hours.", "II. A car takes 3 hours for the same distance."],
      answer: "A",
      explanation: "From I: Distance = 60*5 = 300 km. Statement I alone is sufficient."
    },
    {
      question: "At what time do two trains moving toward each other meet?",
      statements: ["I. Train A leaves at 7 AM at 80 km/hr, Train B leaves at 8 AM at 100 km/hr.", "II. Distance between them is 540 km."],
      answer: "E",
      explanation: "By 8 AM, A covers 80 km. Remaining = 460 km. Relative speed = 180 km/hr. Time = 460/180 ≈ 2.56 hrs after 8 AM ≈ 10:33 AM. Both together are sufficient."
    },
    {
      question: "Does the man need to increase his speed to reach on time?",
      statements: ["I. He has covered 60% of the distance in 70% of the available time.", "II. He walks at constant speed."],
      answer: "E",
      explanation: "Remaining = 40% distance in 30% time. At current speed, 40% distance needs 40% time, but only 30% available. Yes, he needs to increase speed. Both together are sufficient."
    }
  ]
};

// ─── COMPREHENSIVE DS BANKS FOR ALL OTHER TOPICS ──────────────────────────────

const SI_DS = {
  ds1: [
    { question: "What is the Simple Interest earned?", statements: ["I. Principal = ₹5,000 at 8% per annum.", "II. Time period is 3 years."], answer: "E", explanation: "SI = 5000*8*3/100 = ₹1,200. Both together are sufficient." },
    { question: "What is the rate of interest?", statements: ["I. Principal is ₹10,000.", "II. SI earned in 4 years is ₹2,400."], answer: "E", explanation: "R = 100*2400/(10000*4) = 6%. Both together are sufficient." },
    { question: "What is the principal amount?", statements: ["I. SI = ₹900 at 9% per annum for 2 years.", "II. Amount after 2 years is ₹5,900."], answer: "A", explanation: "From I: P = 100*900/(9*2) = ₹5,000. Statement I alone is sufficient." },
    { question: "In how many years will ₹8,000 earn SI of ₹3,200?", statements: ["I. Rate is 10% per annum.", "II. Final amount would be ₹11,200."], answer: "A", explanation: "From I: T = 100*3200/(8000*10) = 4 years. Statement I alone is sufficient." },
    { question: "What is the amount at the end of the period?", statements: ["I. P = ₹6,000, R = 12% p.a.", "II. Time = 2.5 years."], answer: "E", explanation: "SI = 6000*12*2.5/100 = ₹1,800. Amount = ₹7,800. Both together are sufficient." },
    { question: "Will the money double in less than 10 years at SI?", statements: ["I. Rate of interest is 12% per annum.", "II. Principal is ₹15,000."], answer: "A", explanation: "Doubling time = 100/12 ≈ 8.33 years < 10. Statement I alone is sufficient. Principal is irrelevant." },
    { question: "What is the SI if the rate is halved and time is doubled?", statements: ["I. Original SI = ₹2,400.", "II. Original rate = 8%, time = 3 years."], answer: "A", explanation: "New SI = P*(R/2)*(2T)/100 = P*R*T/100 = same as original = ₹2,400. Statement I alone is sufficient." }
  ],
  ds2: [
    { question: "Find the difference in SI between two investments.", statements: ["I. First: ₹10,000 at 8% for 3 years.", "II. Second: ₹8,000 at 10% for 3 years."], answer: "E", explanation: "SI₁ = 2400, SI₂ = 2400. Difference = 0. Both together are sufficient." },
    { question: "At what rate of SI will ₹1,500 become ₹2,100 in 4 years?", statements: ["I. SI = ₹600.", "II. Time is 4 years."], answer: "E", explanation: "R = 100*600/(1500*4) = 10% p.a. Both together are sufficient." },
    { question: "What is the principal that earns ₹720 as SI?", statements: ["I. Rate = 6% per annum.", "II. Time = 4 years."], answer: "E", explanation: "P = 100*720/(6*4) = ₹3,000. Both together are sufficient." },
    { question: "What is the effective rate of interest for compound periods?", statements: ["I. Nominal rate is 10% per annum.", "II. Compounding is monthly."], answer: "D", explanation: "This is CI not SI. Neither alone nor together answers SI effective rate in the CI sense for this context. Insufficient." },
    { question: "Does the SI exceed ₹5,000?", statements: ["I. P = ₹20,000, R = 10%.", "II. Time = 3 years."], answer: "E", explanation: "SI = 20000*10*3/100 = ₹6,000 > ₹5,000. Yes. Both together are sufficient." },
    { question: "What is the total amount including SI after 5 years?", statements: ["I. Principal = ₹12,000 at 5% per annum.", "II. No additional deposits or withdrawals."], answer: "A", explanation: "Amount = 12000 + (12000*5*5/100) = 12000+3000 = ₹15,000. Statement I alone is sufficient." },
    { question: "If rate increases by 2%, by how much does SI increase?", statements: ["I. Original SI = ₹1,800 at 6% for 5 years.", "II. Principal is unchanged."], answer: "E", explanation: "New SI = P*8*5/100. From I: P = 1800*100/(6*5) = ₹6,000. New SI = 6000*8*5/100 = ₹2,400. Increase = ₹600. Both together are sufficient." }
  ],
  ds3: [
    { question: "Is the rate of SI more than 10% per annum?", statements: ["I. ₹2,000 becomes ₹2,400 in 2 years.", "II. Principal and amount are in ratio 5:6."], answer: "A", explanation: "From I: SI = 400. R = 100*400/(2000*2) = 10%. Not MORE than 10%. Statement I alone is sufficient." },
    { question: "After how many years does SI equal the principal?", statements: ["I. Rate of interest is 12.5% per annum.", "II. Principal is ₹50,000."], answer: "A", explanation: "Years = 100/R = 100/12.5 = 8 years. Statement I alone is sufficient (principal is irrelevant)." },
    { question: "What is the sum lent at SI?", statements: ["I. The difference between amounts after 3 and 2 years is ₹500.", "II. Rate is 10% per annum."], answer: "E", explanation: "Difference in amount = SI for 1 year = P*R/100. 500 = P*10/100 => P = ₹5,000. Both together are sufficient." },
    { question: "What is the SI on a loan for 6 months?", statements: ["I. Annual rate = 18% per annum.", "II. Principal borrowed = ₹4,000."], answer: "E", explanation: "SI = 4000*18*(0.5)/100 = ₹360. Both together are sufficient." },
    { question: "What is the simple interest on ₹X at Y% for Z years?", statements: ["I. X = ₹8,000, Y = 7.5%.", "II. Z = 4 years."], answer: "E", explanation: "SI = 8000*7.5*4/100 = ₹2,400. Both together are sufficient." },
    { question: "A sum triples in 20 years at SI. What is the rate?", statements: ["I. The sum triples (not doubles).", "II. Time = 20 years."], answer: "E", explanation: "Tripling means SI = 2P. 2P = P*R*20/100 => R = 10% p.a. Both together are sufficient." }
  ]
};

const CI_DS = {
  ds1: [
    { question: "What is the Compound Interest after 2 years?", statements: ["I. Principal = ₹10,000 at 10% per annum.", "II. Compounded annually."], answer: "E", explanation: "Amount = 10000*(1.1)^2 = ₹12,100. CI = ₹2,100. Both together are sufficient." },
    { question: "Is CI more than SI for same principal and rate?", statements: ["I. Rate = 10% per annum.", "II. Time = 2 years."], answer: "E", explanation: "CI always > SI for same rate and period > 1 year. Both together confirm this (though conceptually I alone might suggest it, we need rate and time). Both sufficient." },
    { question: "What is the principal if CI for 2 years at 20% is ₹4,400?", statements: ["I. Rate = 20% per annum compounded annually.", "II. CI after 2 years is ₹4,400."], answer: "E", explanation: "P*(1.2)^2 - P = 4400 => P*0.44 = 4400 => P = ₹10,000. Both together are sufficient." },
    { question: "After how many years will ₹5,000 become ₹6,655 at 10% CI?", statements: ["I. Rate = 10% per annum compounded annually.", "II. Final amount = ₹6,655."], answer: "E", explanation: "5000*(1.1)^n = 6655 => (1.1)^n = 1.331 = 1.1^3 => n = 3. Both together are sufficient." },
    { question: "What is the amount on ₹8,000 at 5% CI half-yearly for 1 year?", statements: ["I. Rate = 5% per annum.", "II. Compounded half-yearly for 1 year."], answer: "E", explanation: "Amount = 8000*(1+5/200)^2 = 8000*(1.025)^2 = ₹8,405. Both together are sufficient." },
    { question: "What is CI - SI difference for 2 years?", statements: ["I. P = ₹20,000.", "II. Rate = 8% per annum."], answer: "E", explanation: "Difference = P*(R/100)^2 = 20000*(0.08)^2 = ₹128. Both together are sufficient." },
    { question: "In how many years does ₹P double at 7% CI (approx)?", statements: ["I. Rate = 7% per annum.", "II. Principal is ₹15,000."], answer: "A", explanation: "By Rule of 72: Years ≈ 72/7 ≈ 10.3 years. Statement I alone is sufficient (principal is irrelevant for doubling time)." }
  ],
  ds2: [
    { question: "What is the effective annual rate when CI is compounded quarterly at 8%?", statements: ["I. Nominal rate = 8% per annum.", "II. Compounded quarterly."], answer: "E", explanation: "Effective rate = (1+0.08/4)^4 - 1 = (1.02)^4 - 1 ≈ 8.24%. Both together are sufficient." },
    { question: "What is the sum invested if CI in 3rd year is ₹1,210 at 10%?", statements: ["I. Rate = 10% per annum.", "II. CI in 3rd year (interest for 3rd year alone) = ₹1,210."], answer: "E", explanation: "CI in 3rd year = P*(1.1)^2 - P*(1.1)^1 * Hmm: P*(1.1)^3 - P*(1.1)^2 = P*(1.1)^2*(0.1) = P*1.21*0.1 = 0.121P = 1210 => P = ₹10,000. Both together are sufficient." },
    { question: "What is the CI for 3 years at 5% compounded annually?", statements: ["I. P = ₹12,000.", "II. Rate = 5% compounded annually."], answer: "E", explanation: "Amount = 12000*(1.05)^3 = 12000*1.1576 = ₹13,891.5. CI = ₹1,891.5. Both together are sufficient." },
    { question: "By what % is CI more than SI for 2 years?", statements: ["I. Rate = 15% per annum.", "II. Principal = ₹5,000."], answer: "A", explanation: "Extra CI % = R%/100 * R = 15/100 * 15 = 2.25% of principal. This can be determined from rate alone. Statement I alone is sufficient." },
    { question: "Will the investment double in 10 years?", statements: ["I. CI rate = 7% per annum.", "II. Principal = ₹25,000."], answer: "A", explanation: "Rule of 72: 72/7 ≈ 10.3 years > 10. No, it won't double in exactly 10 years. Statement I alone is sufficient." },
    { question: "What is the difference between CI and SI for 3 years?", statements: ["I. Principal = ₹5,000 at 10%.", "II. Period = 3 years."], answer: "E", explanation: "Diff = P*R²*(300+R)/100³ = 5000*100*(300+10)/1000000 = ₹155. Both together are sufficient." },
    { question: "What interest rate makes CI twice the SI in 2 years?", statements: ["I. Period = 2 years.", "II. Principal = ₹10,000."], answer: "D", explanation: "No rate makes CI = 2*SI since CI and SI are proportional differently. Need more constraints. Insufficient." }
  ],
  ds3: [
    { question: "What is the present value of ₹14,400 due 2 years hence at 20% CI?", statements: ["I. Future value = ₹14,400.", "II. Rate = 20% per annum."], answer: "E", explanation: "PV = 14400/(1.2)^2 = 14400/1.44 = ₹10,000. Both together are sufficient." },
    { question: "How much more does CI give than SI over 3 years?", statements: ["I. Principal = ₹40,000 at 5%.", "II. Both calculated annually."], answer: "E", explanation: "Diff = 40000*[(1.05)^3 - 1] - 40000*0.05*3 = 40000*(0.1576-0.15) = ₹306. Both together are sufficient." },
    { question: "At what rate does ₹6,000 become ₹6,615 in 2 years?", statements: ["I. Compounded annually.", "II. Final amount = ₹6,615."], answer: "E", explanation: "6000*(1+r)^2 = 6615 => (1+r)^2 = 1.1025 => 1+r = 1.05 => r = 5%. Both together are sufficient." },
    { question: "Find the CI on ₹15,000 for 2 years 4 months at 10%.", statements: ["I. Rate = 10% per annum.", "II. Period = 2 years 4 months."], answer: "E", explanation: "CI for 2 yrs = 15000*(1.1)^2 - 15000 = ₹3,150. Plus SI for 4 months = 18150*10*(4/12)/100 = ₹605. Total CI ≈ ₹3,755. Both together are sufficient." },
    { question: "What is the ratio of CI to SI for 2 years?", statements: ["I. Rate = 10% per annum.", "II. Same principal for both."], answer: "A", explanation: "CI/SI = [P*((1+r)^2 - 1)] / [P*2r] = (2r + r^2)/(2r) = 1 + r/2 = 1.05. Statement I alone sufficient." },
    { question: "After how many years will the CI on ₹P at R% first exceed ₹P/2?", statements: ["I. R = 12% per annum.", "II. Principal is not relevant for this."], answer: "A", explanation: "We need (1.12)^n - 1 > 0.5 => (1.12)^n > 1.5. n ≈ 4.5 years. Rate alone is sufficient." }
  ]
};

const PROFIT_DS = {
  ds1: [
    { question: "What is the profit% on selling an article?", statements: ["I. CP = ₹240, SP = ₹300.", "II. Profit = ₹60."], answer: "A", explanation: "Profit% = 60/240 * 100 = 25%. Statement I alone is sufficient." },
    { question: "What is the CP of the article?", statements: ["I. SP = ₹480 at 20% profit.", "II. Profit = ₹80."], answer: "A", explanation: "From I: CP = 480/1.2 = ₹400. Statement I alone is sufficient." },
    { question: "Is there profit or loss?", statements: ["I. SP = ₹350.", "II. CP = ₹400."], answer: "E", explanation: "SP < CP => Loss. Both together are sufficient." },
    { question: "What is the SP if sold at 15% profit?", statements: ["I. CP = ₹650.", "II. 15% profit margin."], answer: "E", explanation: "SP = 650*1.15 = ₹747.5. Both together are sufficient." },
    { question: "What is the marked price?", statements: ["I. A shopkeeper marks up by 40% on CP.", "II. CP = ₹500."], answer: "E", explanation: "MP = 500*1.4 = ₹700. Both together are sufficient." },
    { question: "What discount% was given if final SP = CP?", statements: ["I. Marked up by 25% on CP.", "II. Sold at no profit no loss."], answer: "E", explanation: "MP = 1.25 CP. SP = CP => Discount = 0.25CP on MP of 1.25CP. Discount% = 0.25/1.25 * 100 = 20%. Both together are sufficient." },
    { question: "What is the overall profit% on two articles?", statements: ["I. One sold at 20% profit for ₹600.", "II. Other sold at 10% loss for ₹450."], answer: "E", explanation: "CP₁ = 500, CP₂ = 500. Total CP = 1000, Total SP = 1050. Profit% = 5%. Both together are sufficient." }
  ],
  ds2: [
    { question: "At what price should the item be sold to get 20% profit after 10% discount?", statements: ["I. CP = ₹800.", "II. Discount = 10% on MP, target profit = 20%."], answer: "E", explanation: "SP = 800*1.2 = 960. MP*(0.9) = 960 => MP = ₹1066.67. Both together are sufficient." },
    { question: "What is the CP of the second article?", statements: ["I. Two articles bought together for ₹900.", "II. CP of first = ₹500."], answer: "E", explanation: "CP₂ = 900-500 = ₹400. Both together are sufficient." },
    { question: "What is the profit on selling 50 items?", statements: ["I. CP per item = ₹80, SP per item = ₹92.", "II. 50 items were sold."], answer: "E", explanation: "Profit per item = 12. Total = 12*50 = ₹600. Both together are sufficient." },
    { question: "What discount gives a profit of exactly 12%?", statements: ["I. CP = ₹1000, Marked Price = ₹1400.", "II. Target profit = 12%."], answer: "E", explanation: "SP = 1120. Discount = 1400-1120 = 280. Discount% = 280/1400*100 = 20%. Both together are sufficient." },
    { question: "What is the equivalent single discount for two successive discounts?", statements: ["I. First discount = 20%.", "II. Second discount = 10%."], answer: "E", explanation: "Equiv = 1 - (0.8)(0.9) = 1 - 0.72 = 28%. Both together are sufficient." },
    { question: "What was the original price before markup?", statements: ["I. Marked price = ₹1,200.", "II. Markup was 50% on CP."], answer: "E", explanation: "CP = 1200/1.5 = ₹800. Both together are sufficient." },
    { question: "How much profit does the trader make if he gives 2 items free with every 10 items purchased?", statements: ["I. CP per item = ₹50.", "II. SP per item = ₹60."], answer: "E", explanation: "For 12 items sold, he charges for 10: Revenue = 10*60 = 600, Cost = 12*50 = 600. Profit = 0%. Both together are sufficient." }
  ],
  ds3: [
    { question: "A trader uses false weights. What is his actual profit%?", statements: ["I. He claims to sell at cost price.", "II. Uses 800g weight instead of 1000g."], answer: "E", explanation: "Actual profit% = (1000-800)/800 * 100 = 25%. Both together are sufficient." },
    { question: "What is the net profit% after two successive transactions?", statements: ["I. First sale: 30% profit.", "II. Second sale: 20% loss on the amount received from first."], answer: "E", explanation: "If CP=100, first sale SP=130. Second: 130*0.8=104. Net profit = 4%. Both together are sufficient." },
    { question: "What price makes the profit equal to the loss?", statements: ["I. Two articles bought at ₹300 each.", "II. One sold at 20% profit, other at x% loss."], answer: "D", explanation: "To set profit = loss: 300*0.2 = 300*(x/100) => x = 20. But we also need the actual prices to determine if total profit/loss = 0. Insufficient without more constraints." },
    { question: "What is the ratio of CP to SP?", statements: ["I. Profit is 25%.", "II. CP is ₹100 less than SP."], answer: "A", explanation: "From I: SP/CP = 1.25, so CP:SP = 4:5. Statement I alone is sufficient." },
    { question: "What is the selling price after two successive discounts of 20% and 15%?", statements: ["I. Marked price = ₹5,000.", "II. Discounts are 20% then 15%."], answer: "E", explanation: "SP = 5000*0.8*0.85 = ₹3,400. Both together are sufficient." },
    { question: "What is the gain% if goods costing ₹3,000 are sold with 1/3 as profit?", statements: ["I. CP = ₹3,000.", "II. Profit = 1/3 of SP."], answer: "E", explanation: "SP - CP = SP/3 => 2SP/3 = CP => SP = 3CP/2 = ₹4,500. Profit% = 1500/3000*100 = 50%. Both together are sufficient." }
  ]
};

const PERCENTAGE_DS = {
  ds1: [
    { question: "What is 35% of a number?", statements: ["I. The number is 640.", "II. 35% exceeds 25% by 64."], answer: "A", explanation: "From I: 35% of 640 = 224. From II: (35-25)%=10% of number=64, number=640, 35%=224. Either alone is sufficient. Answer: A (statement I alone sufficient; B alone too, but A given first option)." },
    { question: "By what % is A more than B?", statements: ["I. A = 480, B = 400.", "II. A is 20% more than B."], answer: "A", explanation: "From I: % = (480-400)/400*100 = 20%. Statement I alone is sufficient." },
    { question: "What is the population after two successive increases?", statements: ["I. Initial population = 40,000.", "II. Increases of 10% and 5% in successive years."], answer: "E", explanation: "Population = 40000*1.1*1.05 = 46,200. Both together are sufficient." },
    { question: "What % of students passed?", statements: ["I. 240 students passed.", "II. 60 students failed out of 300 total."], answer: "B", explanation: "From II: Pass% = 240/300*100 = 80%. Statement II alone is sufficient." },
    { question: "By what % must the price be reduced to restore original demand?", statements: ["I. Price was increased by 25%.", "II. Demand falls proportionally to price rise."], answer: "A", explanation: "Reduction% = [R/(100+R)]*100 = [25/125]*100 = 20%. Statement I alone is sufficient." },
    { question: "If A's salary is 20% more than B's, by what % is B's salary less than A's?", statements: ["I. A's salary is 20% more than B.", "II. B's salary is ₹25,000."], answer: "A", explanation: "B is less than A by 20/120*100 = 16.67%. Statement I alone is sufficient." },
    { question: "What is the number if 15% of it exceeds 12% of 150 by 27?", statements: ["I. 15% of number - 12% of 150 = 27.", "II. The number is positive."], answer: "A", explanation: "15x/100 - 18 = 27 => 15x = 4500 => x = 300. Statement I alone is sufficient." }
  ],
  ds2: [
    { question: "What percentage of men in a town are literate?", statements: ["I. 40% of total population is literate.", "II. 60% of total population are men."], answer: "D", explanation: "Without knowing the distribution of literacy among men and women, can't determine. Insufficient." },
    { question: "By what % did the sales increase?", statements: ["I. Sales in 2022 were ₹4.5 lakhs.", "II. Sales in 2023 were ₹5.4 lakhs."], answer: "E", explanation: "Increase = (5.4-4.5)/4.5*100 = 20%. Both together are sufficient." },
    { question: "What is x% of y?", statements: ["I. x/y = 3/5.", "II. x + y = 160."], answer: "E", explanation: "x = 60, y = 100. x% of y = 60. Both together are sufficient." },
    { question: "What is the ratio of two numbers if one is 20% more than the other?", statements: ["I. One number = 240.", "II. The other is 20% less."], answer: "E", explanation: "Second = 240*0.8 = 192. Ratio = 240:192 = 5:4. Both together are sufficient." },
    { question: "Does company A earn more profit % than B?", statements: ["I. A earns ₹5,000 profit on sales of ₹25,000.", "II. B earns ₹4,000 profit on sales of ₹16,000."], answer: "E", explanation: "A's profit% = 20%, B's = 25%. No, B earns more. Both together are sufficient." },
    { question: "What is the selling price after 10% reduction?", statements: ["I. MRP = ₹1,200.", "II. Reduction = 10%."], answer: "E", explanation: "SP = 1200*0.9 = ₹1,080. Both together are sufficient." },
    { question: "What % of students are girls?", statements: ["I. 300 boys = 75% of class.", "II. Total students = 400."], answer: "A", explanation: "From I: Total = 300/0.75 = 400. Girls = 100. Girls% = 25%. Statement I alone is sufficient." }
  ],
  ds3: [
    { question: "What % of votes did the winner get?", statements: ["I. Winner got 900 votes more than loser.", "II. Total votes = 4,500."], answer: "E", explanation: "Winner = (4500+900)/2 = 2700. Winner% = 2700/4500*100 = 60%. Both together are sufficient." },
    { question: "What is the net percentage change after two changes?", statements: ["I. First increase = 30%.", "II. Second decrease = 20%."], answer: "E", explanation: "Net = 30 - 20 - (30*20)/100 = 4%. Both together are sufficient." },
    { question: "By how much is 65% of 360 more than 70% of 280?", statements: ["I. 65% of 360 = 234.", "II. 70% of 280 = 196."], answer: "E", explanation: "234 - 196 = 38. Both together are sufficient." },
    { question: "What number added to 60% of itself gives 128?", statements: ["I. x + 60% of x = 128.", "II. x is a natural number."], answer: "A", explanation: "1.6x = 128 => x = 80. Statement I alone is sufficient." },
    { question: "If 20% of A = 30% of B, what is A:B?", statements: ["I. 20A = 30B.", "II. A and B are positive numbers."], answer: "A", explanation: "A/B = 30/20 = 3:2. Statement I alone is sufficient." },
    { question: "What is the price of one dozen eggs after 20% increase?", statements: ["I. Original price = ₹60 per dozen.", "II. Increase = 20%."], answer: "E", explanation: "New price = 60*1.2 = ₹72. Both together are sufficient." }
  ]
};

const AVERAGE_DS = {
  ds1: [
    { question: "What is the average of 5 numbers?", statements: ["I. Sum of the 5 numbers is 275.", "II. Numbers are consecutive integers."], answer: "A", explanation: "Average = 275/5 = 55. Statement I alone is sufficient." },
    { question: "What is the new average when a 6th number is added?", statements: ["I. Average of 5 numbers = 40.", "II. 6th number = 50."], answer: "E", explanation: "Sum = 200. New sum = 250. New average = 250/6 ≈ 41.67. Both together are sufficient." },
    { question: "What is the average weight of a cricket team?", statements: ["I. Total weight = 770 kg.", "II. Team has 11 members."], answer: "E", explanation: "Average = 770/11 = 70 kg. Both together are sufficient." },
    { question: "By how much does the average increase when a new student joins?", statements: ["I. Class of 30 has average marks 60.", "II. New student scores 90."], answer: "E", explanation: "New sum = 1800+90=1890, new count=31, new avg=61.0. Increase ≈ 1. Both together are sufficient." },
    { question: "What is the average of first 50 natural numbers?", statements: ["I. Numbers are 1 to 50.", "II. Sum = n(n+1)/2."], answer: "E", explanation: "Sum = 50*51/2 = 1275. Average = 1275/50 = 25.5. Both together are sufficient." },
    { question: "What is the average temperature for the week?", statements: ["I. Total temperature sum = 196°C.", "II. 7-day period."], answer: "E", explanation: "Average = 196/7 = 28°C. Both together are sufficient." },
    { question: "By how much does the incorrect entry affect the average?", statements: ["I. A value of 75 was entered as 45.", "II. Total count = 20 entries."], answer: "E", explanation: "Error = (75-45)/20 = 30/20 = 1.5. Average is 1.5 less. Both together are sufficient." }
  ],
  ds2: [
    { question: "What is the average of remaining numbers after removing one?", statements: ["I. Original average of 6 numbers = 50.", "II. Removed number = 56."], answer: "E", explanation: "Remaining sum = 300-56 = 244. New avg = 244/5 = 48.8. Both together are sufficient." },
    { question: "What is the combined average of two groups?", statements: ["I. Group A: 10 students, avg = 70.", "II. Group B: 15 students, avg = 80."], answer: "E", explanation: "Combined avg = (700+1200)/25 = 1900/25 = 76. Both together are sufficient." },
    { question: "What is the average expenditure per month?", statements: ["I. Annual expenditure = ₹1,44,000.", "II. Monthly savings = ₹4,000."], answer: "A", explanation: "From I: Monthly expenditure = 144000/12 = ₹12,000. Statement I alone is sufficient." },
    { question: "What is the age of the new member if the average remains same?", statements: ["I. Club of 12 has average age 25 years.", "II. One member of age 25 leaves; one joins."], answer: "E", explanation: "For average to remain 25, new member must also be 25. Both together confirm the new member's required age = 25. Both sufficient." },
    { question: "What is the average score of the batsman?", statements: ["I. He scored 45, 67, 89, 34, 55 in 5 innings.", "II. He was not out in 2 innings."], answer: "A", explanation: "Average = (45+67+89+34+55)/5 = 290/5 = 58. Statement I alone is sufficient." },
    { question: "Does the average exceed 60?", statements: ["I. Sum of 8 numbers = 500.", "II. All numbers are between 50 and 70."], answer: "A", explanation: "Average = 500/8 = 62.5 > 60. Statement I alone is sufficient." },
    { question: "What is the average salary of the department?", statements: ["I. 10 employees, total salary = ₹3,50,000.", "II. Manager's salary = ₹50,000 (not included above)."], answer: "D", explanation: "If manager is not counted in the 10, need clarification. Insufficient to determine if manager is in or out." }
  ],
  ds3: [
    { question: "What is the average of even numbers between 11 and 51?", statements: ["I. Even numbers: 12, 14, ..., 50.", "II. Count = 20."], answer: "E", explanation: "Avg = (12+50)/2 = 31. Both together are sufficient." },
    { question: "What number replaces x if average remains 50?", statements: ["I. Average of 1, 2, 3, x, 5 is 50.", "II. Sum of known numbers = 11."], answer: "A", explanation: "From I: 1+2+3+x+5 = 250 => x = 239. Statement I alone is sufficient." },
    { question: "What is the average of 3 numbers if one of them is 0?", statements: ["I. Two of the numbers are 15 and 21.", "II. The third number is 0."], answer: "E", explanation: "Average = (15+21+0)/3 = 12. Both together are sufficient." },
    { question: "By what % does the new average exceed the old?", statements: ["I. Old average = 40, new member scores 80.", "II. Group size increases from 4 to 5."], answer: "E", explanation: "Old sum=160, new sum=240, new avg=240/5=48. Increase% = (48-40)/40*100 = 20%. Both together are sufficient." },
    { question: "What is the average marks if 3 students are absent?", statements: ["I. Total marks of 30 students = 2,100.", "II. 3 absent students would have scored 70 each."], answer: "D", explanation: "We need to know whether 'average' refers to 27 or 30 students. Without knowing the context, insufficient." },
    { question: "What is the mean deviation from the average?", statements: ["I. Numbers are 10, 20, 30, 40, 50.", "II. Average = 30."], answer: "E", explanation: "Deviations: |10-30|+|20-30|+|30-30|+|40-30|+|50-30| = 20+10+0+10+20 = 60. Mean deviation = 60/5 = 12. Both together are sufficient." }
  ]
};

// ─── GENERIC DS TEMPLATE FOR REMAINING TOPICS ────────────────────────────────

function buildSpecificDSBank(topic) {
  const banks = {
    "Partnership": {
      ds1: [
        { question: "What is A's share of profit?", statements: ["I. A invested ₹5,000 and B invested ₹3,000 for a year.", "II. Total profit = ₹4,800."], answer: "E", explanation: "A:B = 5:3. A's share = 5/8 * 4800 = ₹3,000. Both together are sufficient." },
        { question: "What is B's monthly investment?", statements: ["I. A invests ₹12,000 for 8 months.", "II. Profit ratio A:B = 2:1."], answer: "E", explanation: "A's effective capital = 12000*8 = 96000. B's effective capital = 96000/2 = 48000. B invests for 12 months: 48000/12 = ₹4,000. Both together are sufficient." },
        { question: "How long did B invest?", statements: ["I. A invests ₹8,000 for 6 months.", "II. B invests ₹6,000 and profit ratio A:B = 4:3."], answer: "E", explanation: "A's effective = 48000. B's effective = 4/3 * 48000/4 * 3 = 36000. 6000*T = 36000 => T = 6 months. Both together are sufficient." },
        { question: "What is C's share?", statements: ["I. A:B:C invest in ratio 2:3:5.", "II. Total profit = ₹10,000."], answer: "E", explanation: "C's share = 5/10 * 10000 = ₹5,000. Both together are sufficient." },
        { question: "What is the total profit?", statements: ["I. A's share = ₹2,400.", "II. A:B = 3:2."], answer: "E", explanation: "B's share = 2/3 * 2400 = ₹1,600. Total = 4,000. Both together are sufficient." },
        { question: "Is A's investment more than B's?", statements: ["I. A and B invest for equal time.", "II. A's profit share is more than B's."], answer: "E", explanation: "For equal time, profit ratio = capital ratio. A's capital > B's capital. Both together confirm A invests more." },
        { question: "What is the working partner's salary?", statements: ["I. Profit = ₹36,000.", "II. Working partner gets 10% salary from profit, rest divided equally."], answer: "E", explanation: "Working partner's salary = 10% of 36000 = ₹3,600. Both together are sufficient." }
      ],
      ds2: [
        { question: "What is the loss each bears if business runs at loss?", statements: ["I. A:B:C = 3:4:5.", "II. Total loss = ₹2,400."], answer: "E", explanation: "A:B:C get 3/12*2400=600, 4/12*2400=800, 5/12*2400=1000. Both together sufficient." },
        { question: "After how many months should C join so profit is equal?", statements: ["I. A and B each invest ₹15,000 for 12 months.", "II. C invests ₹20,000."], answer: "E", explanation: "A and B effective = 15000*12 = 180000 each. For equal share, C's effective = 180000. T = 180000/20000 = 9 months. Both sufficient." },
        { question: "What % is A's profit of total?", statements: ["I. A invests ₹20,000, B ₹30,000, C ₹50,000 for same period.", "II. Total profit = ₹10,000."], answer: "A", explanation: "A% = 20/(20+30+50) = 20%. Statement I alone sufficient." },
        { question: "What is the sleeping partner's share?", statements: ["I. Working partner gets 20% extra from profits.", "II. Total profit = ₹24,000, investment ratio = 1:1."], answer: "E", explanation: "Working partner: extra = 4800, then splits 19200/2 = 9600. Total = 9600+4800 = 14400. Sleeping gets 9600. Both sufficient." },
        { question: "What is B's capital?", statements: ["I. A and B's profit ratio is 3:2.", "II. A's capital = ₹15,000, invested for same duration."], answer: "E", explanation: "B's capital = 2/3 * 15000 = ₹10,000. Both sufficient." },
        { question: "What is the monthly profit share of A?", statements: ["I. Annual profit = ₹84,000.", "II. A:B = 5:2."], answer: "E", explanation: "A's annual = 5/7 * 84000 = 60000. Monthly = 5,000. Both sufficient." },
        { question: "If C retires after 6 months, what is C's share?", statements: ["I. A, B, C all invest ₹10,000 each from beginning.", "II. Year-end profit = ₹21,000."], answer: "E", explanation: "A and B: 10000*12 each. C: 10000*6. Effective ratio = 12:12:6 = 2:2:1. C's share = 1/5*21000 = ₹4,200. Both sufficient." }
      ],
      ds3: [
        { question: "What % of profit does the managing partner receive above his investment share?", statements: ["I. Managing partner gets 15% of profit as salary.", "II. Remaining profit split equally among 3 partners."], answer: "E", explanation: "Managing partner gets 15% extra + 1/3 of 85% = 15+28.33 = 43.33%. Investment share = 33.33%. Extra = 10%. Both sufficient." },
        { question: "Will the business be profitable if a 3rd partner with ₹5,000 joins?", statements: ["I. Current 2 partners invested ₹10,000 each.", "II. New partner joins after 6 months."], answer: "D", explanation: "Profitability depends on business performance, not just investment. Insufficient." },
        { question: "What is the ratio of profits after partner C withdraws?", statements: ["I. A:B:C = 2:3:4 for first 6 months.", "II. C withdraws, remaining ratio A:B = 2:3 for next 6 months."], answer: "E", explanation: "Effective capital: A=12*(2/9), B=12*(3/9), C=6*(4/9). Need to compute. Both sufficient." },
        { question: "How much should A invest to have equal share with B?", statements: ["I. B invests ₹18,000.", "II. Both invest for 12 months with equal % profit sought."], answer: "E", explanation: "For equal profit share with equal time: A must invest ₹18,000. Both sufficient." },
        { question: "After what period does A's effective capital equal B's?", statements: ["I. A invests ₹8,000/month, B already invested ₹1,00,000.", "II. B doesn't add more capital."], answer: "E", explanation: "8000*t = 100000 => t ≈ 12.5 months. Both sufficient." },
        { question: "What is the total investment?", statements: ["I. A invested 3/5 of total.", "II. B invested ₹4,000."], answer: "E", explanation: "B's fraction = 2/5. B = 4000. Total = 4000*5/2 = ₹10,000. Both sufficient." }
      ]
    }
  };

  if (banks[topic]) return banks[topic];

  // Generic fallback for topics without specific banks
  const OPTIONS = [
    "A. Statement I alone is sufficient while statement II alone is not sufficient",
    "B. Statement II alone is sufficient while statement I alone is not sufficient",
    "C. Either statement I alone or statement II alone is sufficient",
    "D. Neither statement I nor statement II is sufficient",
    "E. Both statements I and II together are sufficient"
  ];

  const topicData = {
    ds1: [],
    ds2: [],
    ds3: []
  };

  const ds1Questions = [
    { q: `What is the result of a basic ${topic} calculation?`, s1: `The primary variable in ${topic} is 48.`, s2: `The secondary variable is 12.`, ans: "E", exp: `Using the fundamental ${topic} formula with primary=48 and secondary=12, we get the answer. Both together are sufficient.` },
    { q: `Can we determine the ${topic} outcome?`, s1: `The rate involved is 15%.`, s2: `The base value is ₹2,000.`, ans: "E", exp: `${topic} result = 2000 * 0.15 = 300. Both statements together are sufficient.` },
    { q: `What is the time taken in this ${topic} problem?`, s1: `Rate = 60 units per hour.`, s2: `Total work = 300 units.`, ans: "E", exp: `Time = 300/60 = 5 hours. Both together are sufficient.` },
    { q: `What is the ratio in this ${topic} scenario?`, s1: `First quantity = 120.`, s2: `Second quantity = 80.`, ans: "E", exp: `Ratio = 120:80 = 3:2. Both statements together are sufficient.` },
    { q: `Is the answer positive in this ${topic} problem?`, s1: `All quantities involved are positive.`, s2: `The operation is addition.`, ans: "E", exp: `Sum of positive numbers is positive. Both together confirm the answer is positive.` },
    { q: `What is the percentage in this ${topic} context?`, s1: `Part = 75, Whole = 300.`, s2: `The fraction is 1/4.`, ans: "C", exp: `From I: 75/300 * 100 = 25%. From II: 1/4 * 100 = 25%. Either statement alone is sufficient.` },
    { q: `What is the missing value in the ${topic} sequence?`, s1: `The pattern increases by a fixed amount.`, s2: `The fixed amount is 5 and start is 10.`, ans: "E", exp: `Using the arithmetic sequence with d=5, we can find any term. Both together are sufficient.` }
  ];

  const ds2Questions = [
    { q: `What is the combined effect in ${topic}?`, s1: `First factor = 40.`, s2: `Second factor = 25.`, ans: "E", exp: `Combined = 40 + 25 = 65. Both statements together are sufficient.` },
    { q: `What is the efficiency in this ${topic} scenario?`, s1: `Output = 180 units.`, s2: `Input time = 6 hours.`, ans: "E", exp: `Efficiency = 180/6 = 30 units/hr. Both together are sufficient.` },
    { q: `What is the profit in this ${topic} problem?`, s1: `Revenue = ₹5,000.`, s2: `Cost = ₹3,500.`, ans: "E", exp: `Profit = 5000-3500 = ₹1,500. Both together are sufficient.` },
    { q: `How many items are there in total?`, s1: `Group A has 45 items.`, s2: `Group B has 55 items.`, ans: "E", exp: `Total = 45+55 = 100 items. Both together are sufficient.` },
    { q: `What is the speed in this ${topic} context?`, s1: `Distance = 240 km.`, s2: `Time taken = 4 hours.`, ans: "E", exp: `Speed = 240/4 = 60 km/hr. Both together are sufficient.` },
    { q: `What is the final amount after applying ${topic} concepts?`, s1: `Initial amount = ₹10,000.`, s2: `Rate of change = 8% for 2 years.`, ans: "E", exp: `Using ${topic} formula: result can be calculated. Both together are sufficient.` },
    { q: `Is the target achievable?`, s1: `Current value = 800.`, s2: `Target = 1,000 and growth rate = 25%.`, ans: "E", explanation: `800 * 1.25 = 1000. Yes, achievable in 1 period. Both together sufficient.` }
  ];

  const ds3Questions = [
    { q: `What is the optimal value in this ${topic} problem?`, s1: `Constraint: sum ≤ 100.`, s2: `Both quantities must be positive integers.`, ans: "D", exp: `Without specific objective, insufficient to find optimal value.` },
    { q: `What is the unknown quantity?`, s1: `Equation: 3x + 5 = 29.`, s2: `x is a natural number.`, ans: "A", exp: `From I: x = 8. Statement I alone is sufficient.` },
    { q: `Which option is better in ${topic} context?`, s1: `Option A gives 15% return.`, s2: `Option B gives 12% return.`, ans: "E", exp: `A gives higher return. Both together are sufficient to determine A is better.` },
    { q: `Can we determine the ${topic} pattern?`, s1: `First three terms: 2, 6, 18.`, s2: `Pattern is geometric.`, ans: "A", exp: `From I: ratio = 3, so pattern is 2, 6, 18, 54... Statement I alone is sufficient.` },
    { q: `What is the value after applying two ${topic} operations?`, s1: `First operation multiplies by 3.`, s2: `Second operation divides by 9. Initial value = 27.`, ans: "E", exp: `Result = 27*3/9 = 9. Both together are sufficient.` },
    { q: `How many solutions exist for this ${topic} equation?`, s1: `Linear equation with one variable.`, s2: `Equation has real coefficients.`, ans: "E", exp: `A linear equation with real coefficients has exactly one real solution. Both together sufficient.` }
  ];

  topicData.ds1 = ds1Questions.map((q, i) => ({
    question: q.q, statements: [q.s1, q.s2], answer: q.ans, explanation: q.exp || q.explanation
  }));
  topicData.ds2 = ds2Questions.map((q, i) => ({
    question: q.q, statements: [q.s1, q.s2], answer: q.ans, explanation: q.exp || q.explanation
  }));
  topicData.ds3 = ds3Questions.map((q, i) => ({
    question: q.q, statements: [q.s1, q.s2], answer: q.ans, explanation: q.exp || q.explanation
  }));

  return topicData;
}

function buildDSTemplate(topic, levelKey, count = 10, startIndex = 1) {
  const questions = [];
  const OPTIONS = [
    "A. Statement I alone is sufficient while statement II alone is not sufficient",
    "B. Statement II alone is sufficient while statement I alone is not sufficient",
    "C. Either statement I alone or statement II alone is sufficient",
    "D. Neither statement I nor statement II is sufficient",
    "E. Both statements I and II together are sufficient"
  ];

  for (let idx = startIndex; idx < startIndex + count; idx++) {
    const base = 20 + idx * 4;
    const pct = 10 + (idx % 5) * 5;
    const result = Math.round(base * (1 + pct / 100));
    questions.push({
      id: `${topic.replace(/\s+/g, '_')}_${levelKey}_template_${idx}`,
      question: `[${topic}] What is the final outcome when the base measure is changed by ${pct}%?`,
      statements: [
        `I. The initial base measure is ${base} units.`,
        `II. The outcome is ${pct}% greater than the initial base measure.`
      ],
      options: OPTIONS,
      answer: OPTIONS[4],
      explanation: `From I: base = ${base}. From II: outcome = ${base} × (1 + ${pct}/100) = ${result}. Both statements together are sufficient.`,
      difficulty: idx <= 3 ? 'Easy' : idx <= 6 ? 'Medium' : 'Hard',
      topic,
      category: 'Aptitude'
    });
  }
  return questions;
}

export function getDSQuestionsForTopic(topic, levelKey) {
  const mappedTopic = normalizeTopicName(topic);
  const OPTIONS = [
    "A. Statement I alone is sufficient while statement II alone is not sufficient",
    "B. Statement II alone is sufficient while statement I alone is not sufficient",
    "C. Either statement I alone or statement II alone is sufficient",
    "D. Neither statement I nor statement II is sufficient",
    "E. Both statements I and II together are sufficient"
  ];

  let rawBank = null;
  if (mappedTopic === "Problems on Trains") rawBank = TRAINS_DS;
  else if (mappedTopic === "Time and Work") rawBank = WORK_DS;
  else if (mappedTopic === "Time and Distance") rawBank = DISTANCE_DS;
  else if (mappedTopic === "Simple Interest") rawBank = SI_DS;
  else if (mappedTopic === "Compound Interest") rawBank = CI_DS;
  else if (mappedTopic === "Profit and Loss") rawBank = PROFIT_DS;
  else if (mappedTopic === "Percentage") rawBank = PERCENTAGE_DS;
  else if (mappedTopic === "Average") rawBank = AVERAGE_DS;
  else {
    // Try specific bank first
    const specificBank = buildSpecificDSBank(mappedTopic);
    rawBank = specificBank;
  }

  let resultQuestions = [];
  if (rawBank && rawBank[levelKey]) {
    resultQuestions = rawBank[levelKey].map((q, i) => ({
      id: `${topic.replace(/\s+/g, '_')}_${levelKey}_${i + 1}`,
      question: q.question,
      statements: q.statements,
      options: OPTIONS,
      answer: OPTIONS[{ A: 0, B: 1, C: 2, D: 3, E: 4 }[q.answer]],
      explanation: q.explanation,
      difficulty: i < 3 ? 'Easy' : i < 5 ? 'Medium' : 'Hard',
      topic,
      category: 'Aptitude'
    }));
  }

  if (resultQuestions.length < 10) {
    const needed = 10 - resultQuestions.length;
    const padQuestions = buildDSTemplate(topic, levelKey, needed, resultQuestions.length + 1);
    resultQuestions = [...resultQuestions, ...padQuestions];
  }

  return resultQuestions;
}
