const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config();

const mongoose = require('mongoose');
const AptitudeQuestion = require('../models/AptitudeQuestion');
const TechnicalQuestion = require('../models/TechnicalQuestion');
const DSAQuestion = require('../models/DSAQuestion');
const CompanyPrep = require('../models/CompanyPrep');
const GovPrep = require('../models/GovPrep');
const MockTest = require('../models/MockTest');
const PrepCategory = require('../models/PrepCategory');
const PrepCompany = require('../models/PrepCompany');

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

const ALL_TOPICS = [
  "Problems on Trains", "Time and Distance", "Height and Distance", "Time and Work",
  "Simple Interest", "Compound Interest", "Profit and Loss", "Partnership",
  "Percentage", "Problems on Ages", "Calendar", "Clock", "Average", "Area",
  "Volume and Surface Area", "Permutation and Combination", "Numbers",
  "Problems on Numbers", "Problems on H.C.F and L.C.M", "Decimal Fraction",
  "Simplification", "Square Root and Cube Root", "Surds and Indices",
  "Ratio and Proportion", "Chain Rule", "Pipes and Cistern", "Boats and Streams",
  "Alligation or Mixture", "Logarithm", "Races and Games", "Stocks and Shares",
  "Probability", "True Discount", "Banker's Discount", "Odd Man Out and Series",
  "Set Theory"
];

// ─── HELPER FUNCTIONS ──────────────────────────────────────────────
function factorial(n) { if (n <= 1) return 1; return n * factorial(n - 1); }
function gcd(a, b) { return b === 0 ? a : gcd(b, a % b); }

function generateQuestionsForTopicAndCategory(category = 'Aptitude', topic) {
  const list = [];
  for (let i = 1; i <= 20; i++) {
    let question = "";
    let options = [];
    let answer = "";
    let explanation = "";
    let difficulty = i <= 6 ? 'Easy' : i <= 14 ? 'Medium' : 'Hard';

    if (topic === "Problems on Trains") {
      const length = 100 + i * 15;
      const time = 5 + (i % 5) * 3;
      const speedMPS = (length / time).toFixed(2);
      const speedKMPH = (speedMPS * 3.6).toFixed(1);
      question = `A train ${length}m long passes a standing signal post in ${time} seconds. What is the speed of the train in km/h?`;
      const ansVal = `${speedKMPH} km/h`;
      answer = ansVal;
      options = [ansVal, `${(parseFloat(speedKMPH) + 12).toFixed(1)} km/h`, `${(parseFloat(speedKMPH) - 8).toFixed(1)} km/h`, `${(parseFloat(speedKMPH) * 1.25).toFixed(1)} km/h`].sort(() => Math.random() - 0.5);
      explanation = `Speed = ${length}m / ${time}s = ${speedMPS} m/s. × (18/5) = ${speedKMPH} km/h.`;
    }
    else if (topic === "Time and Distance") {
      const dist = 50 + i * 20; const speed = 10 + (i % 4) * 15; const time = (dist / speed).toFixed(2);
      question = `A motorist covers ${dist} km at ${speed} km/h. Time taken?`;
      answer = `${time} hours`;
      options = [answer, `${(parseFloat(time)+0.5).toFixed(2)} hours`, `${(parseFloat(time)*0.8).toFixed(2)} hours`, `${(parseFloat(time)+1.2).toFixed(2)} hours`].sort(() => Math.random() - 0.5);
      explanation = `Time = ${dist}/${speed} = ${time} hours.`;
    }
    else if (topic === "Height and Distance") {
      const base = 20 + i * 5; const angle = i % 2 === 0 ? 30 : 60;
      const height = (angle === 30 ? base / Math.sqrt(3) : base * Math.sqrt(3)).toFixed(1);
      question = `The shadow of a tower is ${base}m when sun's altitude is ${angle}°. Find the height.`;
      answer = `${height} m`;
      options = [answer, `${(parseFloat(height)+10).toFixed(1)} m`, `${(parseFloat(height)-5).toFixed(1)} m`, `${(parseFloat(height)*1.5).toFixed(1)} m`].sort(() => Math.random() - 0.5);
      explanation = `Height = base × tan(${angle}°) = ${height} m.`;
    }
    else if (topic === "Time and Work") {
      const rateA = 10 + (i % 5) * 5; const rateB = 12 + (i % 4) * 6;
      const combined = (rateA * rateB) / (rateA + rateB);
      question = `A can do work in ${rateA} days, B in ${rateB} days. Together they take?`;
      answer = `${combined.toFixed(1)} days`;
      options = [answer, `${(combined+1.5).toFixed(1)} days`, `${(combined-1).toFixed(1)} days`, `${(combined*1.3).toFixed(1)} days`].sort(() => Math.random() - 0.5);
      explanation = `1/A + 1/B = 1/T. T = (A×B)/(A+B) = (${rateA}×${rateB})/(${rateA}+${rateB}) = ${combined.toFixed(1)} days.`;
    }
    else if (topic === "Simple Interest") {
      const p = 1000 + i * 500; const r = 5 + (i % 5); const t = 2 + (i % 3);
      const si = (p * r * t) / 100;
      question = `Find Simple Interest on ₹${p} at ${r}% p.a. for ${t} years.`;
      answer = `₹${si}`;
      options = [answer, `₹${si+100}`, `₹${si-50}`, `₹${Math.round(si*1.2)}`].sort(() => Math.random() - 0.5);
      explanation = `S.I. = (P × R × T)/100 = (${p} × ${r} × ${t})/100 = ₹${si}.`;
    }
    else if (topic === "Compound Interest") {
      const p = 2000 + i * 500; const r = 6 + (i % 4); const t = 2;
      const amt = p * Math.pow(1 + r/100, t);
      const ci = Math.round(amt - p);
      question = `Find Compound Interest on ₹${p} at ${r}% p.a. for ${t} years compounded annually.`;
      answer = `₹${ci}`;
      options = [answer, `₹${ci+80}`, `₹${ci-40}`, `₹${Math.round(ci*1.15)}`].sort(() => Math.random() - 0.5);
      explanation = `Amount = P(1 + R/100)^T = ${p}(1 + ${r}/100)^2 = ₹${Math.round(amt)}. C.I. = Amount - P = ₹${ci}.`;
    }
    else if (topic === "Profit and Loss") {
      const cp = 500 + i * 50; const profitPct = 10 + (i % 5) * 5;
      const sp = Math.round(cp * (1 + profitPct/100));
      question = `A shopkeeper buys an article for ₹${cp} and sells it at ${profitPct}% profit. Find Selling Price.`;
      answer = `₹${sp}`;
      options = [answer, `₹${sp+45}`, `₹${sp-30}`, `₹${Math.round(sp*1.1)}`].sort(() => Math.random() - 0.5);
      explanation = `S.P. = C.P. × (100 + Profit%)/100 = ${cp} × ${100 + profitPct}/100 = ₹${sp}.`;
    }
    else if (topic === "Partnership") {
      const capA = 5000 + i * 1000; const capB = 7000 + (i % 4) * 2000;
      const totalProfit = 12000;
      const shareA = Math.round((capA / (capA + capB)) * totalProfit);
      question = `A and B invest ₹${capA} and ₹${capB} in a business. Total profit is ₹${totalProfit}. Find A's share.`;
      answer = `₹${shareA}`;
      options = [answer, `₹${shareA+1200}`, `₹${shareA-800}`, `₹${Math.round(shareA*1.25)}`].sort(() => Math.random() - 0.5);
      explanation = `Ratio of shares = Capital ratio = ${capA}:${capB}. A's share = (${capA}/${capA + capB}) × ${totalProfit} = ₹${shareA}.`;
    }
    else if (topic === "Percentage") {
      const val = 120 + i * 15; const pct = 15 + (i % 5) * 5;
      const res = ((pct / 100) * val).toFixed(1);
      question = `What is ${pct}% of ${val}?`;
      answer = `${res}`;
      options = [answer, `${(parseFloat(res)+8.5).toFixed(1)}`, `${(parseFloat(res)-4).toFixed(1)}`, `${(parseFloat(res)*1.2).toFixed(1)}`].sort(() => Math.random() - 0.5);
      explanation = `Value = (${pct}/100) * ${val} = ${res}.`;
    }
    else if (topic === "Problems on Ages") {
      const ratioA = 2 + (i % 3); const ratioB = 3 + (i % 3);
      const diff = 4 + (i % 4) * 2;
      const multiplier = diff / (ratioB - ratioA);
      const ageA = ratioA * multiplier;
      question = `The ratio of ages of A and B is ${ratioA}:${ratioB}. B is ${diff} years older than A. Find A's present age.`;
      answer = `${ageA} years`;
      options = [answer, `${ageA+6} years`, `${ageA-3} years`, `${Math.round(ageA*1.5)} years`].sort(() => Math.random() - 0.5);
      explanation = `Difference in ratio parts = ${ratioB} - ${ratioA} = ${ratioB - ratioA}. Since ${ratioB - ratioA} parts = ${diff} years, 1 part = ${multiplier} years. A's age = ${ratioA} × ${multiplier} = ${ageA} years.`;
    }
    else if (topic === "Calendar") {
      const years = [2004, 2007, 2012, 2015, 2019, 2024];
      const yr = years[i % years.length];
      const isLeap = (yr % 4 === 0 && yr % 100 !== 0) || (yr % 400 === 0);
      question = `How many odd days are there in the year ${yr}?`;
      answer = isLeap ? "2 odd days" : "1 odd day";
      options = ["1 odd day", "2 odd days", "3 odd days", "0 odd days"];
      explanation = `${yr} is ${isLeap ? 'a leap' : 'an ordinary'} year. It has ${isLeap ? 366 : 365} days = 52 weeks + ${isLeap ? 2 : 1} days. Thus it has ${isLeap ? 2 : 1} odd day(s).`;
    }
    else if (topic === "Clock") {
      const hours = 1 + (i % 11); const mins = (i % 4) * 15;
      const angle = Math.abs(30 * hours - 5.5 * mins);
      const normalizedAngle = angle > 180 ? 360 - angle : angle;
      question = `Find the angle between the hour hand and minute hand of a clock at ${hours}:${mins === 0 ? '00' : mins}.`;
      answer = `${normalizedAngle}°`;
      options = [answer, `${normalizedAngle+15}°`, `${Math.max(0, normalizedAngle-25)}°`, `${360-normalizedAngle}°`].sort(() => Math.random() - 0.5);
      explanation = `Angle = |30H - 5.5M| = |30(${hours}) - 5.5(${mins})| = ${angle}°. Adjusted to <= 180° gives ${normalizedAngle}°.`;
    }
    else if (topic === "Average") {
      const listSize = 4 + (i % 3);
      const startNum = 10 + i * 2;
      const sum = (listSize * (2 * startNum + (listSize - 1) * 2)) / 2;
      const avg = sum / listSize;
      question = `Find the average of ${listSize} consecutive even numbers starting from ${startNum}.`;
      answer = `${avg}`;
      options = [answer, `${avg+2}`, `${avg-1}`, `${avg+4}`].sort(() => Math.random() - 0.5);
      explanation = `Numbers are: ${Array.from({length: listSize}, (_, idx) => startNum + idx * 2).join(', ')}. Sum = ${sum}. Average = ${sum}/${listSize} = ${avg}.`;
    }
    else if (topic === "Area") {
      const length = 10 + i * 2; const width = 5 + (i % 4) * 3;
      const area = length * width;
      question = `Find the area of a rectangular field of length ${length}m and width ${width}m.`;
      answer = `${area} sq.m`;
      options = [answer, `${area+25} sq.m`, `${area-15} sq.m`, `${length*2 + width*2} sq.m`].sort(() => Math.random() - 0.5);
      explanation = `Area = Length × Width = ${length} × ${width} = ${area} sq.m.`;
    }
    else if (topic === "Volume and Surface Area") {
      const r = 3 + (i % 3); const h = 7 + (i % 4) * 2;
      const vol = Math.round(Math.PI * r * r * h);
      question = `Find the approximate volume of a cylinder with radius ${r}m and height ${h}m. (Use π ≈ 3.14)`;
      answer = `${vol} cubic m`;
      options = [answer, `${vol+80} cubic m`, `${vol-50} cubic m`, `${Math.round(vol*1.2)} cubic m`].sort(() => Math.random() - 0.5);
      explanation = `Volume = π × r² × h ≈ 3.14 × ${r * r} × ${h} = ${vol} cubic m.`;
    }
    else if (topic === "Permutation and Combination") {
      const n = 5 + (i % 4); const r = 2 + (i % 3);
      const perm = Math.round(factorial(n) / factorial(n - r));
      const comb = Math.round(perm / factorial(r));
      const isPerm = i % 2 === 0;
      question = isPerm 
        ? `In how many ways can a President and Secretary be chosen from ${n} members? (Order matters)`
        : `In how many ways can a committee of ${r} members be chosen from ${n} candidates? (Order does not matter)`;
      answer = isPerm ? `${perm} ways` : `${comb} ways`;
      options = [answer, isPerm ? `${perm+10} ways` : `${comb+5} ways`, isPerm ? `${perm-8} ways` : `${Math.max(1, comb-3)} ways`, `${perm + comb} ways`].sort(() => Math.random() - 0.5);
      explanation = isPerm 
        ? `Permutation: P(${n}, ${r}) = ${n}! / (${n}-${r})! = ${perm} ways.` 
        : `Combination: C(${n}, ${r}) = ${n}! / (${r}! × (${n}-${r})!) = ${comb} ways.`;
    }
    else if (topic === "Numbers") {
      const num = 100 + i * 13; const divisor = 7 + (i % 5);
      const remainder = num % divisor;
      question = `What is the remainder when ${num} is divided by ${divisor}?`;
      answer = `${remainder}`;
      options = [answer, `${(remainder+1)%divisor}`, `${Math.max(0, remainder-1)}`, `${divisor-1}`].sort(() => Math.random() - 0.5);
      explanation = `${num} = ${divisor} × ${Math.floor(num/divisor)} + ${remainder}. Remainder is ${remainder}.`;
    }
    else if (topic === "Problems on Numbers") {
      const x = 15 + i * 3;
      const equationVal = 3 * x - 15;
      question = `Three times a number subtracted by 15 is equal to ${equationVal}. Find the number.`;
      answer = `${x}`;
      options = [answer, `${x+5}`, `${x-3}`, `${x*2}`].sort(() => Math.random() - 0.5);
      explanation = `3x - 15 = ${equationVal} => 3x = ${equationVal + 15} => x = ${x}.`;
    }
    else if (topic === "Problems on H.C.F and L.C.M") {
      const val1 = 12 + i * 4; const val2 = 18 + i * 6;
      const commonG = gcd(val1, val2);
      const lcm = (val1 * val2) / commonG;
      const isHcf = i % 2 === 0;
      question = isHcf 
        ? `Find the H.C.F. of ${val1} and ${val2}.` 
        : `Find the L.C.M. of ${val1} and ${val2}.`;
      answer = isHcf ? `${commonG}` : `${lcm}`;
      options = [answer, isHcf ? `${commonG+2}` : `${lcm+36}`, isHcf ? `${Math.max(1, commonG-2)}` : `${lcm-12}`, `${val1 + val2}`].sort(() => Math.random() - 0.5);
      explanation = isHcf 
        ? `HCF of ${val1} and ${val2} is ${commonG}.` 
        : `LCM of ${val1} and ${val2} is (Product / HCF) = (${val1} × ${val2}) / ${commonG} = ${lcm}.`;
    }
    else if (topic === "Decimal Fraction") {
      const dec1 = (0.12 * i).toFixed(2); const dec2 = (0.4 + (i%5)*0.1).toFixed(1);
      const sum = (parseFloat(dec1) + parseFloat(dec2)).toFixed(2);
      question = `Simplify: ${dec1} + ${dec2}`;
      answer = `${sum}`;
      options = [answer, `${(parseFloat(sum)+0.11).toFixed(2)}`, `${(parseFloat(sum)-0.05).toFixed(2)}`, `${(parseFloat(sum)*1.2).toFixed(2)}`].sort(() => Math.random() - 0.5);
      explanation = `Sum of ${dec1} and ${dec2} is ${sum}.`;
    }
    else if (topic === "Simplification") {
      const a = 10 + i; const b = 5 + (i%3); const c = 2 + (i%2);
      const res = a * b - c;
      question = `Simplify: ${a} × ${b} - ${c}`;
      answer = `${res}`;
      options = [answer, `${res+10}`, `${res-5}`, `${a * (b - c)}`].sort(() => Math.random() - 0.5);
      explanation = `Using BODMAS, multiply first: ${a} × ${b} = ${a*b}. Then subtract: ${a*b} - ${c} = ${res}.`;
    }
    else if (topic === "Square Root and Cube Root") {
      const num = 10 + i; const sq = num * num; const cube = num * num * num;
      const isSqrt = i % 2 === 0;
      question = isSqrt 
        ? `Find the square root of ${sq}.` 
        : `Find the cube root of ${cube}.`;
      answer = `${num}`;
      options = [answer, `${num+2}`, `${num-1}`, `${num*2}`].sort(() => Math.random() - 0.5);
      explanation = isSqrt 
        ? `√${sq} = ${num} since ${num}² = ${sq}.` 
        : `³√${cube} = ${num} since ${num}³ = ${cube}.`;
    }
    else if (topic === "Surds and Indices") {
      const base = 2 + (i % 3); const power1 = 3 + (i % 2); const power2 = 2;
      const res = Math.pow(base, power1 - power2);
      question = `Simplify: (${base}^${power1}) / (${base}^${power2})`;
      answer = `${res}`;
      options = [answer, `${res*base}`, `${Math.pow(base, power1 + power2)}`, `1`].sort(() => Math.random() - 0.5);
      explanation = `a^m / a^n = a^(m-n). Here ${base}^(${power1}-${power2}) = ${base}^${power1-power2} = ${res}.`;
    }
    else if (topic === "Ratio and Proportion") {
      const a = 2 + (i % 3); const b = 3 + (i % 2); const c = 12 + i * 4;
      const d = (b * c) / a;
      question = `Find the fourth proportional to ${a}, ${b}, and ${c}.`;
      answer = `${d}`;
      options = [answer, `${d+4}`, `${d-2}`, `${d*2}`].sort(() => Math.random() - 0.5);
      explanation = `a:b :: c:d => a/b = c/d => d = (b × c)/a = (${b} × ${c})/${a} = ${d}.`;
    }
    else if (topic === "Chain Rule") {
      const men1 = 10 + i; const days1 = 12; const men2 = men1 + 5;
      const days2 = ((men1 * days1) / men2).toFixed(1);
      question = `If ${men1} men can complete a job in ${days1} days, in how many days can ${men2} men do the same job?`;
      answer = `${days2} days`;
      options = [answer, `${(parseFloat(days2)+2).toFixed(1)} days`, `${(parseFloat(days2)-1.5).toFixed(1)} days`, `${((men1*days1)/men2 * 1.3).toFixed(1)} days`].sort(() => Math.random() - 0.5);
      explanation = `M₁ × D₁ = M₂ × D₂ => ${men1} × ${days1} = ${men2} × D₂ => D₂ = ${men1 * days1}/${men2} = ${days2} days.`;
    }
    else if (topic === "Pipes and Cistern") {
      const pipeA = 4 + (i % 4) * 2; const pipeB = 6 + (i % 3) * 3;
      const time = (pipeA * pipeB) / (pipeA + pipeB);
      question = `Pipe A fills a tank in ${pipeA} hours and Pipe B in ${pipeB} hours. Together they fill it in?`;
      answer = `${time.toFixed(1)} hours`;
      options = [answer, `${(time+1.2).toFixed(1)} hours`, `${(time-0.8).toFixed(1)} hours`, `${(time*1.35).toFixed(1)} hours`].sort(() => Math.random() - 0.5);
      explanation = `Time = (A × B) / (A + B) = (${pipeA} × ${pipeB}) / (${pipeA} + ${pipeB}) = ${time.toFixed(1)} hours.`;
    }
    else if (topic === "Boats and Streams") {
      const boatSpeed = 12 + i; const streamSpeed = 2 + (i % 3);
      const downstream = boatSpeed + streamSpeed; const upstream = boatSpeed - streamSpeed;
      const isDown = i % 2 === 0;
      question = isDown 
        ? `A boat speed is ${boatSpeed} km/h and stream is ${streamSpeed} km/h. Find downstream speed.` 
        : `A boat speed is ${boatSpeed} km/h and stream is ${streamSpeed} km/h. Find upstream speed.`;
      answer = isDown ? `${downstream} km/h` : `${upstream} km/h`;
      options = [answer, `${boatSpeed} km/h`, `${downstream + upstream} km/h`, `${isDown ? downstream - 3 : upstream + 3} km/h`].sort(() => Math.random() - 0.5);
      explanation = isDown 
        ? `Downstream Speed = Boat Speed + Stream Speed = ${boatSpeed} + ${streamSpeed} = ${downstream} km/h.` 
        : `Upstream Speed = Boat Speed - Stream Speed = ${boatSpeed} - ${streamSpeed} = ${upstream} km/h.`;
    }
    else if (topic === "Alligation or Mixture") {
      const p1 = 40 + i * 2; const p2 = 60 + i * 3; const mean = Math.round((p1 + p2) / 2);
      question = `In what ratio must rice at ₹${p1}/kg be mixed with rice at ₹${p2}/kg so that mixture is worth ₹${mean}/kg?`;
      answer = "1:1";
      options = ["1:1", "2:3", "3:4", "1:2"].sort(() => Math.random() - 0.5);
      explanation = `Using Alligation rule: Ratio = (Cheaper diff) : (Dearer diff) = (${p2}-${mean}) : (${mean}-${p1}) = ${p2-mean}:${mean-p1} = 1:1.`;
    }
    else if (topic === "Logarithm") {
      const base = 2 + (i % 3); const val = Math.pow(base, 3 + (i % 2));
      const exp = Math.log(val) / Math.log(base);
      question = `Find the value of log_${base}(${val}).`;
      answer = `${Math.round(exp)}`;
      options = [answer, `${Math.round(exp)+1}`, `${Math.round(exp)-1}`, `${base}`].sort(() => Math.random() - 0.5);
      explanation = `log_b(a) = c means b^c = a. Here ${base}^${Math.round(exp)} = ${val}. Thus answer is ${Math.round(exp)}.`;
    }
    else if (topic === "Races and Games") {
      const dist = 100 + i * 50; const start = 10 + i * 2;
      question = `In a ${dist}m race, A beats B by ${start}m. What distance did B cover when A reached the finish line?`;
      answer = `${dist - start} m`;
      options = [answer, `${dist} m`, `${dist - start - 10} m`, `${dist - start + 5} m`].sort(() => Math.random() - 0.5);
      explanation = `B's distance = Total race distance - beat distance = ${dist}m - ${start}m = ${dist - start}m.`;
    }
    else if (topic === "Stocks and Shares") {
      const faceVal = 100; const premium = 10 + i * 2; const marketVal = faceVal + premium;
      question = `Find the market value of a ₹${faceVal} share quoted at ₹${premium} premium.`;
      answer = `₹${marketVal}`;
      options = [answer, `₹${premium}`, `₹${faceVal - premium}`, `₹${faceVal}`].sort(() => Math.random() - 0.5);
      explanation = `Market Value = Face Value + Premium = ${faceVal} + ${premium} = ₹${marketVal}.`;
    }
    else if (topic === "Probability") {
      const totalBalls = 10 + (i % 5); const redBalls = 3 + (i % 3);
      const prob = (redBalls / totalBalls).toFixed(3);
      question = `A bag contains ${redBalls} red balls and ${totalBalls - redBalls} blue balls. One ball is drawn at random. Find probability that it is red.`;
      answer = `${redBalls}/${totalBalls}`;
      options = [answer, `${totalBalls - redBalls}/${totalBalls}`, `1/${totalBalls}`, `1/2`].sort(() => Math.random() - 0.5);
      explanation = `Probability = Favorable cases / Total cases = ${redBalls} / ${totalBalls}.`;
    }
    else if (topic === "True Discount") {
      const pw = 1000 + i * 100; const r = 5; const t = 1;
      const td = (pw * r * t) / 100;
      const amount = pw + td;
      question = `Find True Discount on ₹${amount} due 1 year hence at ${r}% p.a.`;
      answer = `₹${td}`;
      options = [answer, `₹${td+20}`, `₹${td-15}`, `₹${pw}`].sort(() => Math.random() - 0.5);
      explanation = `True Discount = (Amount × R × T) / (100 + R × T) = (${amount} × ${r} × 1) / 105 = ₹${td}.`;
    }
    else if (topic === "Banker's Discount") {
      const p = 2000 + i * 200; const r = 6; const t = 1;
      const bd = (p * r * t) / 100;
      question = `Find the Banker's Discount on a bill of ₹${p} due 1 year hence at ${r}% p.a.`;
      answer = `₹${bd}`;
      options = [answer, `₹${bd+10}`, `₹${bd-15}`, `₹${Math.round(bd*1.1)}`].sort(() => Math.random() - 0.5);
      explanation = `Banker's Discount = Simple Interest on bill face value = (Face Value × R × T)/100 = (${p} × ${r} × ${t})/100 = ₹${bd}.`;
    }
    else if (topic === "Odd Man Out and Series") {
      const d = 3 + (i % 4); const start = 5 + i * 2;
      const terms = Array.from({length: 5}, (_, idx) => start + idx * d);
      terms[4] = terms[4] + 2; // corrupt the 5th term
      question = `Find the odd man out in the series: ${terms.join(', ')}`;
      answer = `${terms[4]}`;
      options = [answer, `${terms[0]}`, `${terms[2]}`, `${terms[3]}`].sort(() => Math.random() - 0.5);
      explanation = `AP with d=${d}. ${terms[4]} breaks the pattern (should be ${start+4*d}).`;
    }
    else if (topic === "Set Theory") {
      const setASize = 3 + (i % 4);
      const setBSize = 4 + (i % 3);
      const intersectionSize = 1 + (i % 2);
      const unionSize = setASize + setBSize - intersectionSize;
      const queryType = i % 2 === 0 ? "union" : "intersection";
      
      if (queryType === "union") {
        question = `In a group of students, ${setASize * 10} play football, ${setBSize * 10} play cricket, and ${intersectionSize * 10} play both. How many play at least one of these games?`;
        answer = `${unionSize * 10}`;
        options = [answer, `${(unionSize + 2) * 10}`, `${(unionSize - 2) * 10}`, `${(setASize + setBSize) * 10}`].sort(() => Math.random() - 0.5);
        explanation = `n(A ∪ B) = n(A) + n(B) - n(A ∩ B) = ${setASize * 10} + ${setBSize * 10} - ${intersectionSize * 10} = ${unionSize * 10}.`;
      } else {
        question = `If Set A has ${setASize} elements and Set B has ${setBSize} elements, and Set A ∪ B has ${unionSize} elements, find the number of elements in Set A ∩ B.`;
        answer = `${intersectionSize}`;
        options = [answer, `${intersectionSize + 2}`, `${intersectionSize + 1}`, `${Math.max(0, intersectionSize - 1)}`].sort(() => Math.random() - 0.5);
        explanation = `n(A ∩ B) = n(A) + n(B) - n(A ∪ B) = ${setASize} + ${setBSize} - ${unionSize} = ${intersectionSize}.`;
      }
    }
    else if (category === "Data Interpretation") {
      const yearStart = 2020 + (i % 3);
      const val1 = 100 + i * 15;
      const val2 = 120 + i * 20;
      const diff = val2 - val1;
      const pctGrowth = ((diff / val1) * 100).toFixed(1);
      
      if (topic === "Table Charts") {
        question = `Refer to the Table Chart showing sales (in tons) for consecutive years. In ${yearStart}, sales were ${val1} tons, and in ${yearStart + 1} they were ${val2} tons. What is the percentage increase in sales?`;
        answer = `${pctGrowth}%`;
        options = [answer, `${(parseFloat(pctGrowth) + 5.5).toFixed(1)}%`, `${(parseFloat(pctGrowth) - 4.2).toFixed(1)}%`, `${(parseFloat(pctGrowth) * 1.2).toFixed(1)}%`].sort(() => Math.random() - 0.5);
        explanation = `Percentage Increase = ((Sales in ${yearStart + 1} - Sales in ${yearStart}) / Sales in ${yearStart}) * 100 = ((${val2} - ${val1}) / ${val1}) * 100 = (${diff} / ${val1}) * 100 = ${pctGrowth}%.`;
      }
      else if (topic === "Bar Charts") {
        question = `According to the Bar Chart, the production of wheat in State A was ${val1} thousand tons, and in State B it was ${val2} thousand tons. Find the ratio of production of State A to State B.`;
        const commonG = gcd(val1, val2);
        answer = `${val1 / commonG}:${val2 / commonG}`;
        options = [answer, `${(val1 / commonG) + 1}:${(val2 / commonG)}`, `${val1 / commonG}:${(val2 / commonG) + 2}`, `1:2`].sort(() => Math.random() - 0.5);
        explanation = `Ratio = Production of State A : Production of State B = ${val1} : ${val2} = ${val1 / commonG}:${val2 / commonG}.`;
      }
      else if (topic === "Pie Charts") {
        const pctVal = 10 + (i % 6) * 8;
        const degreeVal = (pctVal * 3.6).toFixed(1);
        question = `In a Pie Chart representing a company's total annual budget, the marketing department is allocated ${pctVal}% of the total budget. What is the corresponding central angle in degrees?`;
        answer = `${degreeVal}°`;
        options = [answer, `${(parseFloat(degreeVal) + 15).toFixed(1)}°`, `${(parseFloat(degreeVal) - 20).toFixed(1)}°`, `${(parseFloat(degreeVal) * 1.15).toFixed(1)}°`].sort(() => Math.random() - 0.5);
        explanation = `Central Angle = (${pctVal} / 100) * 360 = ${pctVal} * 3.6 = ${degreeVal}°.`;
      }
      else {
        question = `The Line Chart tracks monthly profits of a firm. If profit in Month 1 is ₹${val1}k and in Month 2 is ₹${val2}k, what is the absolute change in profit?`;
        answer = `₹${diff}k`;
        options = [answer, `₹${diff + 10}k`, `₹${Math.max(5, diff - 15)}k`, `₹${Math.round(diff * 1.5)}k`].sort(() => Math.random() - 0.5);
        explanation = `Absolute Change = Profit in Month 2 - Profit in Month 1 = ₹${val2}k - ₹${val1}k = ₹${diff}k.`;
      }
    }
    else if (category === "Verbal Ability" || category === "Verbal") {
      const vocabPool = [
        { word: "Abundant", syn: "Plentiful", ant: "Scarce" },
        { word: "Benevolent", syn: "Kind", ant: "Malevolent" },
        { word: "Candid", syn: "Honest", ant: "Deceitful" },
        { word: "Diligent", syn: "Hardworking", ant: "Lazy" },
        { word: "Eloquent", syn: "Fluent", ant: "Inarticulate" },
        { word: "Fortitude", syn: "Courage", ant: "Weakness" },
        { word: "Gregarious", syn: "Sociable", ant: "Introverted" },
        { word: "Hinder", syn: "Obstruct", ant: "Assist" },
        { word: "Impartial", syn: "Unbiased", ant: "Biased" },
        { word: "Judicious", syn: "Wise", ant: "Foolish" }
      ];
      const vocab = vocabPool[i % vocabPool.length];
      
      if (topic === "Synonyms") {
        question = `Choose the option that is closest in meaning to the word: "${vocab.word}"`;
        answer = vocab.syn;
        options = [answer, vocab.ant, "Irrelevant", "Temporary"].sort(() => Math.random() - 0.5);
        explanation = `"${vocab.word}" means exhibiting or characterized by a certain positive quality; its synonym is "${vocab.syn}".`;
      }
      else if (topic === "Antonyms") {
        question = `Choose the option that is most opposite in meaning to the word: "${vocab.word}"`;
        answer = vocab.ant;
        options = [answer, vocab.syn, "Ordinary", "Permanent"].sort(() => Math.random() - 0.5);
        explanation = `The opposite of "${vocab.word}" is "${vocab.ant}".`;
      }
      else if (topic === "Spotting Errors") {
        const errorSentences = [
          { s: "Neither of the two candidates have submitted their papers.", err: "have submitted (should be 'has submitted')", opts: ["have submitted", "Neither of", "submitted", "No error"] },
          { s: "He is senior than me in service.", err: "than (should be 'to')", opts: ["than", "senior", "in service", "No error"] },
          { s: "Unless you do not work hard, you cannot pass.", err: "do not (should be omitted)", opts: ["do not", "Unless", "cannot pass", "No error"] }
        ];
        const item = errorSentences[i % errorSentences.length];
        question = `Find the part of the sentence containing a grammatical error: "${item.s}"`;
        answer = item.err;
        options = item.opts;
        explanation = `The correct grammar is: "${item.s.replace(item.err.split(' ')[0], 'has')}".`;
      }
      else {
        question = `Identify the correct usage or sentence structure related to ${topic} for question ${i}.`;
        answer = "Option A";
        options = ["Option A", "Option B", "Option C", "Option D"].sort(() => Math.random() - 0.5);
        explanation = `Applying standard grammar rules for ${topic} gives Option A as the correct answer.`;
      }
    }
    else if (category.includes("Reasoning")) {
      if (topic === "Number Series") {
        const patterns = [
          { seq: "2, 5, 10, 17, 26, ?", ans: "37", exp: "Squares + 1: 1^2+1, 2^2+1, 3^2+1, 4^2+1, 5^2+1, 6^2+1 = 37" },
          { seq: "3, 6, 12, 24, 48, ?", ans: "96", exp: "Geometric progression with common ratio 2: 48 * 2 = 96" },
          { seq: "5, 10, 15, 20, 25, ?", ans: "30", exp: "Arithmetic progression with common difference 5: 25 + 5 = 30" }
        ];
        const p = patterns[i % patterns.length];
        question = `Find the next number in the series: ${p.seq}`;
        answer = p.ans;
        options = [answer, `${parseInt(answer)+5}`, `${parseInt(answer)-3}`, `${parseInt(answer)*2}`].sort(() => Math.random() - 0.5);
        explanation = p.exp;
      }
      else if (topic === "Blood Relation Test" || topic === "Blood Relation" || topic === "Blood Relation Test") {
        question = `Pointing to a photograph, a man says: "She is the daughter of my father's only son." How is the woman in the photograph related to the man?`;
        answer = "Daughter";
        options = ["Daughter", "Sister", "Mother", "Niece"].sort(() => Math.random() - 0.5);
        explanation = `"Father's only son" is the man himself. His daughter is therefore his daughter.`;
      }
      else {
        question = `In a ${topic} problem, if A relates to B in a certain way, find the corresponding relation or term for index ${i}.`;
        answer = "Option A";
        options = ["Option A", "Option B", "Option C", "Option D"].sort(() => Math.random() - 0.5);
        explanation = `Following logical deduction principles for ${topic}, Option A is correct.`;
      }
    }
    else if (category === "Current Affairs Categories" || category === "General Knowledge") {
      question = `Which of the following is correct regarding "${topic}" in context of question ${i}?`;
      answer = "Statement A is correct";
      options = ["Statement A is correct", "Statement B is correct", "Both are incorrect", "None of these"].sort(() => Math.random() - 0.5);
      explanation = `Based on standard facts and records, Statement A is the verified fact for ${topic}.`;
    }
    else {
      const num1 = 10 + i * 3;
      const num2 = 5 + (i % 5) * 4;
      const product = num1 * num2;
      question = `${topic}: Primary variable=${num1}, multiplier=${num2}. Result?`;
      answer = `${product}`;
      options = [answer, `${product+15}`, `${product-10}`, `${Math.round(product*1.2)}`].sort(() => Math.random() - 0.5);
      explanation = `${num1} × ${num2} = ${product}.`;
    }

    list.push({
      category: category,
      topic: topic,
      question: question,
      options: options,
      answer: answer,
      explanation: explanation,
      difficulty: difficulty
    });
  }
  return list;
}

// ─── TECHNICAL MCQ QUESTIONS ───────────────────────────────────────
const technicalQuestions = [
  {
    topic: 'JavaScript', type: 'MCQ',
    question: 'What is the output of: typeof null?',
    options: ['null', 'object', 'undefined', 'string'],
    answer: 'object',
    explanation: 'This is a well-known JavaScript quirk. typeof null returns "object" due to a historical bug in JS implementation.',
    difficulty: 'Easy'
  },
  {
    topic: 'JavaScript', type: 'MCQ',
    question: 'Which method does NOT mutate the original array?',
    options: ['push()', 'map()', 'splice()', 'sort()'],
    answer: 'map()',
    explanation: 'map() returns a new array and does not modify the original. push, splice, and sort all mutate the original.',
    difficulty: 'Medium'
  },
  {
    topic: 'React', type: 'MCQ',
    question: 'What hook is used to run a side effect after every render in React?',
    options: ['useState', 'useEffect', 'useCallback', 'useMemo'],
    answer: 'useEffect',
    explanation: 'useEffect runs after render. With no dependency array, it runs after every render.',
    difficulty: 'Easy'
  },
  {
    topic: 'React', type: 'MCQ',
    question: 'What does the React key prop do?',
    options: ['Styles a component', 'Gives a unique identity to list items for reconciliation', 'Triggers re-render', 'Passes data between components'],
    answer: 'Gives a unique identity to list items for reconciliation',
    explanation: 'React uses key to efficiently reconcile DOM changes in lists. Without a stable key, React may incorrectly reuse components.',
    difficulty: 'Easy'
  },
  {
    topic: 'Node.js', type: 'MCQ',
    question: 'Which module is used to create a simple HTTP server in Node.js?',
    options: ['fs', 'http', 'path', 'url'],
    answer: 'http',
    explanation: 'The "http" core module provides createServer() to build an HTTP server in Node.js.',
    difficulty: 'Easy'
  },
  {
    topic: 'SQL', type: 'MCQ',
    question: 'Which SQL clause is used to filter groups?',
    options: ['WHERE', 'HAVING', 'FILTER', 'GROUP FILTER'],
    answer: 'HAVING',
    explanation: 'HAVING is applied after GROUP BY to filter groups. WHERE filters individual rows before grouping.',
    difficulty: 'Easy'
  },
  {
    topic: 'SQL', type: 'MCQ',
    question: 'What is the difference between INNER JOIN and LEFT JOIN?',
    options: [
      'INNER JOIN returns all rows from left table; LEFT JOIN returns matching rows',
      'INNER JOIN returns only matching rows; LEFT JOIN returns all rows from left table',
      'They are the same',
      'LEFT JOIN returns all rows from both tables'
    ],
    answer: 'INNER JOIN returns only matching rows; LEFT JOIN returns all rows from left table',
    explanation: 'INNER JOIN returns rows where there is a match in both tables. LEFT JOIN returns all rows from left even if no match in right.',
    difficulty: 'Medium'
  },
  {
    topic: 'OS', type: 'MCQ',
    question: 'What is a deadlock?',
    options: [
      'When CPU is idle',
      'When two or more processes wait for each other to release resources indefinitely',
      'When memory is full',
      'When a process terminates abnormally'
    ],
    answer: 'When two or more processes wait for each other to release resources indefinitely',
    explanation: 'Deadlock occurs when processes are blocked because each holds resources needed by another, creating a cycle.',
    difficulty: 'Medium'
  },
  {
    topic: 'Networks', type: 'MCQ',
    question: 'Which protocol is used for secure HTTP communication?',
    options: ['FTP', 'HTTP', 'HTTPS', 'SMTP'],
    answer: 'HTTPS',
    explanation: 'HTTPS uses TLS/SSL encryption on top of HTTP to provide secure communication over the internet.',
    difficulty: 'Easy'
  },
  {
    topic: 'Python', type: 'MCQ',
    question: 'What is the output of: print(type([]))?',
    options: ['<class list>', "<class 'list'>", 'list', 'array'],
    answer: "<class 'list'>",
    explanation: "Python's type() returns the class object. Printing it shows <class 'list'>.",
    difficulty: 'Easy'
  },
  {
    topic: 'Java', type: 'MCQ',
    question: 'Which keyword is used to prevent a class from being subclassed in Java?',
    options: ['static', 'abstract', 'final', 'sealed'],
    answer: 'final',
    explanation: 'The final keyword applied to a class prevents any other class from extending it.',
    difficulty: 'Easy'
  },
  {
    topic: 'Java', type: 'Interview',
    question: 'Explain the difference between abstract class and interface in Java.',
    options: [],
    answer: 'An abstract class can have concrete methods and state; an interface defines a contract with all abstract methods (pre-Java 8). From Java 8, interfaces can have default and static methods. A class can implement multiple interfaces but extend only one abstract class.',
    explanation: 'Use abstract class when sharing code among closely related classes. Use interface to define a contract that unrelated classes can implement.',
    difficulty: 'Medium'
  },
];

// ─── DSA QUESTIONS ─────────────────────────────────────────────────
const dsaQuestions = [
  {
    topic: 'Arrays', title: 'Two Sum',
    problemStatement: 'Given an array of integers nums and a target integer target, return indices of the two numbers such that they add up to target.',
    difficulty: 'Easy',
    solutionCode: `function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) return [map.get(complement), i];
    map.set(nums[i], i);
  }
  return [];
}`,
    explanation: 'Use a hashmap to store each number\'s index. For each element, check if its complement (target - current) exists in the map. Time O(n), Space O(n).'
  },
  {
    topic: 'Arrays', title: 'Maximum Subarray (Kadane\'s Algorithm)',
    problemStatement: 'Find the contiguous subarray with the maximum sum.',
    difficulty: 'Medium',
    solutionCode: `function maxSubArray(nums) {
  let maxSum = nums[0], currentSum = nums[0];
  for (let i = 1; i < nums.length; i++) {
    currentSum = Math.max(nums[i], currentSum + nums[i]);
    maxSum = Math.max(maxSum, currentSum);
  }
  return maxSum;
}`,
    explanation: 'Kadane\'s: At each position, decide to extend the current subarray or start fresh. Track global max. Time O(n), Space O(1).'
  },
  {
    topic: 'Linked List', title: 'Reverse a Linked List',
    problemStatement: 'Given the head of a singly linked list, reverse the list and return its head.',
    difficulty: 'Easy',
    solutionCode: `function reverseList(head) {
  let prev = null, curr = head;
  while (curr) {
    const next = curr.next;
    curr.next = prev;
    prev = curr;
    curr = next;
  }
  return prev;
}`,
    explanation: 'Iteratively reverse pointers. Use three pointers: prev, curr, next. At each step, reverse curr.next to prev. Time O(n), Space O(1).'
  },
  {
    topic: 'Stack', title: 'Valid Parentheses',
    problemStatement: 'Given a string of brackets, determine if the input is valid (properly opened and closed).',
    difficulty: 'Easy',
    solutionCode: `function isValid(s) {
  const stack = [];
  const map = { ')': '(', '}': '{', ']': '[' };
  for (const ch of s) {
    if ('({['.includes(ch)) stack.push(ch);
    else if (stack.pop() !== map[ch]) return false;
  }
  return stack.length === 0;
}`,
    explanation: 'Use a stack. Push opening brackets. For closing brackets, check the top of stack matches. If not, return false. Time O(n), Space O(n).'
  },
  {
    topic: 'Binary Search', title: 'Binary Search',
    problemStatement: 'Given a sorted array and target, return the index of the target (-1 if not found).',
    difficulty: 'Easy',
    solutionCode: `function search(nums, target) {
  let lo = 0, hi = nums.length - 1;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (nums[mid] === target) return mid;
    else if (nums[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}`,
    explanation: 'Classic binary search. Maintain lo and hi pointers. Compare mid element to target and eliminate half the search space each iteration. Time O(log n).'
  },
  {
    topic: 'Dynamic Programming', title: 'Fibonacci Number (Memoization)',
    problemStatement: 'Return the nth Fibonacci number using dynamic programming.',
    difficulty: 'Easy',
    solutionCode: `function fib(n, memo = {}) {
  if (n <= 1) return n;
  if (memo[n]) return memo[n];
  return (memo[n] = fib(n - 1, memo) + fib(n - 2, memo));
}`,
    explanation: 'Top-down DP with memoization. Store results of subproblems to avoid repeated work. Time O(n), Space O(n).'
  },
  {
    topic: 'Trees', title: 'Maximum Depth of Binary Tree',
    problemStatement: 'Find the maximum depth (height) of a binary tree.',
    difficulty: 'Easy',
    solutionCode: `function maxDepth(root) {
  if (!root) return 0;
  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}`,
    explanation: 'DFS recursion. Base case: null node has depth 0. Recursively find max of left and right subtrees and add 1. Time O(n).'
  },
  {
    topic: 'Graphs', title: 'Number of Islands (BFS)',
    problemStatement: 'Given a 2D grid map of \'1\' (land) and \'0\' (water), count the number of islands.',
    difficulty: 'Medium',
    solutionCode: `function numIslands(grid) {
  let count = 0;
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      if (grid[i][j] === '1') {
        count++;
        bfs(grid, i, j);
      }
    }
  }
  return count;
}
function bfs(grid, r, c) {
  const queue = [[r, c]];
  grid[r][c] = '0';
  const dirs = [[1,0],[-1,0],[0,1],[0,-1]];
  while (queue.length) {
    const [x, y] = queue.shift();
    for (const [dx, dy] of dirs) {
      const nx = x+dx, ny = y+dy;
      if (nx >= 0 && ny >= 0 && nx < grid.length && ny < grid[0].length && grid[nx][ny] === '1') {
        grid[nx][ny] = '0';
        queue.push([nx, ny]);
      }
    }
  }
}`,
    explanation: 'BFS from each unvisited land cell, marking connected land as visited. Number of BFS initiations = number of islands. Time O(m×n).'
  },
];

// ─── COMPANY PREP ──────────────────────────────────────────────────
const companyPrep = [
  {
    company: 'TCS', category: 'Aptitude',
    question: 'TCS NQT: If a + b = 10 and a - b = 4, what is a × b?',
    options: ['21', '24', '25', '20'],
    answer: '21',
    explanation: 'a = 7, b = 3. Product = 21.',
    difficulty: 'Easy'
  },
  {
    company: 'TCS', category: 'Coding',
    question: 'Write a program to find if a number is Armstrong (narcissistic). 153 = 1³ + 5³ + 3³',
    options: ['True for 153', 'False for 153', 'True for 100', 'False for 370'],
    answer: 'True for 153',
    explanation: 'Armstrong number: sum of each digit raised to power of number of digits equals the number itself.',
    difficulty: 'Medium'
  },
  {
    company: 'Accenture', category: 'Aptitude',
    question: 'Accenture: A pipe can fill a tank in 6 hours. Another can empty it in 8 hours. If both open together, in how many hours is the tank filled?',
    options: ['24', '20', '18', '16'],
    answer: '24',
    explanation: 'Net fill rate = 1/6 - 1/8 = 1/24. So 24 hours.',
    difficulty: 'Medium'
  },
  {
    company: 'Infosys', category: 'Aptitude',
    question: 'Infosys: At what rate of SI will a sum of money double in 8 years?',
    options: ['10.5%', '12%', '12.5%', '15%'],
    answer: '12.5%',
    explanation: 'SI = P×R×T/100. For doubling, SI = P. R = 100/(T) = 100/8 = 12.5%',
    difficulty: 'Easy'
  },
  {
    company: 'Wipro', category: 'Interview',
    question: 'Explain OOPS concepts used in your projects.',
    options: [],
    answer: 'OOP concepts include: Encapsulation (wrapping data and methods), Inheritance (deriving new class from existing), Polymorphism (one interface, many implementations), Abstraction (hiding implementation details).',
    explanation: 'Always relate to real project examples when answering OOP questions in Wipro interviews.',
    difficulty: 'Medium'
  },
  {
    company: 'Amazon', category: 'Coding',
    question: 'Amazon OA: Given an array, find the largest subarray with sum <= K.',
    options: ['Sliding window', 'Binary search', 'Brute force O(n²)', 'Hashing'],
    answer: 'Sliding window',
    explanation: 'Use sliding window when subarray conditions involve sums. Adjust window by moving left pointer when sum exceeds K.',
    difficulty: 'Hard'
  },
  {
    company: 'Google', category: 'Interview',
    question: 'Explain how Google Search indexes web pages at a high level.',
    options: [],
    answer: 'Crawling (fetching pages via Googlebot) → Indexing (parsing and storing content in inverted index) → Ranking (using PageRank and 200+ signals) → Serving results.',
    explanation: 'Google interviews often test system design understanding even for SWE roles.',
    difficulty: 'Hard'
  },
];

// ─── GOVERNMENT EXAM PREP ──────────────────────────────────────────
const govPrep = [
  {
    exam: 'SSC', category: 'Aptitude',
    question: 'SSC CGL: If 8 men can finish a work in 12 days, then 12 men can finish the same work in how many days?',
    options: ['8', '6', '10', '9'],
    answer: '8',
    explanation: 'M1×D1 = M2×D2. 8×12 = 12×D2. D2 = 8 days.',
    difficulty: 'Easy'
  },
  {
    exam: 'SSC', category: 'Reasoning',
    question: 'SSC CHSL: Find the odd one out: Apple, Mango, Carrot, Banana',
    options: ['Apple', 'Mango', 'Carrot', 'Banana'],
    answer: 'Carrot',
    explanation: 'Apple, Mango, Banana are fruits. Carrot is a vegetable — the odd one out.',
    difficulty: 'Easy'
  },
  {
    exam: 'Banking', category: 'Aptitude',
    question: 'IBPS PO: A sum doubles at 5% compound interest per annum. In how many years?',
    options: ['14.2 years', '15 years', '12 years', '16 years'],
    answer: '14.2 years',
    explanation: 'Using rule of 72: Years ≈ 72/5 = 14.2 years (approximate for compound doubling).',
    difficulty: 'Medium'
  },
  {
    exam: 'Banking', category: 'English',
    question: 'IBPS: Choose the correctly spelled word:',
    options: ['Accomodate', 'Accommodate', 'Accommadate', 'Acomodate'],
    answer: 'Accommodate',
    explanation: 'Accommodate has double c and double m: ac-com-mo-date.',
    difficulty: 'Easy'
  },
  {
    exam: 'Railway', category: 'Aptitude',
    question: 'RRB: A train covers a distance of 200 km in 4 hours. What is its speed in m/s?',
    options: ['13.89', '55.55', '50', '15'],
    answer: '13.89',
    explanation: 'Speed = 200km/4h = 50 km/h = 50×(1000/3600) = 13.89 m/s.',
    difficulty: 'Easy'
  },
  {
    exam: 'UPSC', category: 'Previous Papers',
    question: 'UPSC Prelims: Which Article of the Indian Constitution abolishes untouchability?',
    options: ['Article 15', 'Article 17', 'Article 14', 'Article 21'],
    answer: 'Article 17',
    explanation: 'Article 17 abolishes untouchability and forbids its practice in any form.',
    difficulty: 'Medium'
  },
];

// ─── MOCK TESTS ─────────────────────────────────────────────────────
const mockTests = [
  {
    title: 'Aptitude Quick Test — 15 min',
    type: 'Aptitude',
    duration: 15,
    questions: [
      {
        questionText: 'Find the next number: 1, 4, 9, 16, ?',
        options: ['20', '25', '24', '23'],
        answer: '25',
        explanation: 'Pattern: squares of 1,2,3,4,5. Next = 25.'
      },
      {
        questionText: 'A man walks 5 km north, then 3 km east. How far is he from start?',
        options: ['8 km', '√34 km', '√25 km', '6 km'],
        answer: '√34 km',
        explanation: 'Distance = √(5²+3²) = √34 km'
      },
      {
        questionText: 'What is 15% of 200?',
        options: ['20', '25', '30', '35'],
        answer: '30',
        explanation: '15% of 200 = 0.15 × 200 = 30'
      },
      {
        questionText: 'A can do work in 12 days, B in 18 days. Together in how many days?',
        options: ['6', '7.2', '8', '9'],
        answer: '7.2',
        explanation: '1/12 + 1/18 = 5/36. Days = 36/5 = 7.2'
      },
      {
        questionText: 'If SP = ₹480 and profit = 20%, find CP.',
        options: ['₹400', '₹380', '₹420', '₹450'],
        answer: '₹400',
        explanation: 'CP = SP/1.2 = 480/1.2 = ₹400'
      },
    ]
  },
  {
    title: 'Technical MCQ Test — 20 min',
    type: 'Technical',
    duration: 20,
    questions: [
      {
        questionText: 'Which data structure uses LIFO principle?',
        options: ['Queue', 'Stack', 'Heap', 'Array'],
        answer: 'Stack',
        explanation: 'Stack follows Last In, First Out (LIFO). Queue follows FIFO.'
      },
      {
        questionText: 'What is the time complexity of binary search?',
        options: ['O(n)', 'O(n²)', 'O(log n)', 'O(1)'],
        answer: 'O(log n)',
        explanation: 'Binary search eliminates half the array each step → O(log n).'
      },
      {
        questionText: 'In JavaScript, which is NOT a falsy value?',
        options: ['0', '""', 'null', '"false"'],
        answer: '"false"',
        explanation: 'The string "false" is truthy. Only the boolean false is falsy, not string "false".'
      },
      {
        questionText: 'Which HTTP method is idempotent and safe?',
        options: ['POST', 'DELETE', 'GET', 'PATCH'],
        answer: 'GET',
        explanation: 'GET is both idempotent (same result every time) and safe (no side effects).'
      },
      {
        questionText: 'What does SQL GROUP BY do?',
        options: ['Sorts records', 'Groups records with same values for aggregate functions', 'Filters records', 'Joins tables'],
        answer: 'Groups records with same values for aggregate functions',
        explanation: 'GROUP BY combines rows with identical values in specified columns for use with COUNT, SUM, AVG etc.'
      },
    ]
  },
];

// ─── EXPORTED FUNCTION (no connect/disconnect — uses existing connection) ────
async function seedPrepData() {
  try {
    const techCount = await TechnicalQuestion.countDocuments();
    const dsaCount = await DSAQuestion.countDocuments();
    const compCount = await CompanyPrep.countDocuments();
    const govCount = await GovPrep.countDocuments();
    const mockCount = await MockTest.countDocuments();

    const defaultCategories = [
      {
        name: "Quantitative Aptitude",
        order: 1,
        status: "active",
        subCategories: [
          {
            name: "Arithmetic",
            order: 1,
            status: "active",
            topics: [
              { name: "HCF and LCM", order: 1, status: "active" },
              { name: "Averages", order: 2, status: "active" },
              { name: "Alligation and Mixture", order: 3, status: "active" },
              { name: "Percentages", order: 4, status: "active" },
              { name: "Profit and Loss", order: 5, status: "active" },
              { name: "Ratio and Proportion", order: 6, status: "active" },
              { name: "Time and Work", order: 7, status: "active" },
              { name: "Time Speed Distance", order: 8, status: "active" },
              { name: "Probability", order: 9, status: "active" },
              { name: "Permutation and Combination", order: 10, status: "active" },
              { name: "Mensuration", order: 11, status: "active" },
              { name: "Logarithms", order: 12, status: "active" }
            ]
          },
          {
            name: "Algebra & Logic",
            order: 2,
            status: "active",
            topics: [
              { name: "Set Theory", order: 1, status: "active" }
            ]
          }
        ]
      },
      {
        name: "Data Interpretation",
        order: 2,
        status: "active",
        subCategories: [
          {
            name: "Charts",
            order: 1,
            status: "active",
            topics: [
              { name: "Table Charts", order: 1, status: "active" },
              { name: "Bar Charts", order: 2, status: "active" },
              { name: "Pie Charts", order: 3, status: "active" },
              { name: "Line Charts", order: 4, status: "active" }
            ]
          }
        ]
      },
      {
        name: "Verbal Ability",
        order: 3,
        status: "active",
        subCategories: [
          {
            name: "Grammar & Correction",
            order: 1,
            status: "active",
            topics: [
              { name: "Spotting Errors", order: 1, status: "active" },
              { name: "Sentence Correction", order: 2, status: "active" },
              { name: "Sentence Improvement", order: 3, status: "active" },
              { name: "Change of Voice", order: 4, status: "active" },
              { name: "Change of Speech", order: 5, status: "active" }
            ]
          },
          {
            name: "Vocabulary & Words",
            order: 2,
            status: "active",
            topics: [
              { name: "Synonyms", order: 1, status: "active" },
              { name: "Antonyms", order: 2, status: "active" },
              { name: "Selecting Words", order: 3, status: "active" },
              { name: "Spellings", order: 4, status: "active" },
              { name: "One Word Substitutes", order: 5, status: "active" },
              { name: "Idioms and Phrases", order: 6, status: "active" },
              { name: "Verbal Analogies", order: 7, status: "active" }
            ]
          },
          {
            name: "Sentence & Paragraph Ordering",
            order: 3,
            status: "active",
            topics: [
              { name: "Sentence Formation", order: 1, status: "active" },
              { name: "Ordering of Words", order: 2, status: "active" },
              { name: "Completing Statements", order: 3, status: "active" },
              { name: "Ordering of Sentences", order: 4, status: "active" },
              { name: "Paragraph Formation", order: 5, status: "active" },
              { name: "Cloze Test", order: 6, status: "active" },
              { name: "Reading Comprehension", order: 7, status: "active" }
            ]
          }
        ]
      },
      {
        name: "Logical Reasoning",
        order: 4,
        status: "active",
        subCategories: [
          {
            name: "Analytical Logic",
            order: 1,
            status: "active",
            topics: [
              { name: "Number Series", order: 1, status: "active" },
              { name: "Letter and Symbol Series", order: 2, status: "active" },
              { name: "Verbal Classification", order: 3, status: "active" },
              { name: "Essential Part", order: 4, status: "active" },
              { name: "Analogies", order: 5, status: "active" },
              { name: "Artificial Language", order: 6, status: "active" },
              { name: "Matching Definitions", order: 7, status: "active" },
              { name: "Making Judgments", order: 8, status: "active" },
              { name: "Logical Problems", order: 9, status: "active" },
              { name: "Logical Games", order: 10, status: "active" },
              { name: "Analyzing Arguments", order: 11, status: "active" }
            ]
          },
          {
            name: "Deductions & Assertions",
            order: 2,
            status: "active",
            topics: [
              { name: "Statement and Assumption", order: 1, status: "active" },
              { name: "Course of Action", order: 2, status: "active" },
              { name: "Statement and Conclusion", order: 3, status: "active" },
              { name: "Theme Detection", order: 4, status: "active" },
              { name: "Cause and Effect", order: 5, status: "active" },
              { name: "Statement and Argument", order: 6, status: "active" },
              { name: "Logical Deduction", order: 7, status: "active" }
            ]
          }
        ]
      },
      {
        name: "Verbal Reasoning",
        order: 5,
        status: "active",
        subCategories: [
          {
            name: "Reasoning Concepts",
            order: 1,
            status: "active",
            topics: [
              { name: "Logical Sequence of Words", order: 1, status: "active" },
              { name: "Blood Relation Test", order: 2, status: "active" },
              { name: "Syllogism", order: 3, status: "active" },
              { name: "Series Completion", order: 4, status: "active" },
              { name: "Dice", order: 5, status: "active" },
              { name: "Venn Diagrams", order: 6, status: "active" },
              { name: "Cube and Cuboid", order: 7, status: "active" },
              { name: "Analogy", order: 8, status: "active" },
              { name: "Seating Arrangement", order: 9, status: "active" },
              { name: "Character Puzzles", order: 10, status: "active" },
              { name: "Direction Sense Test", order: 11, status: "active" },
              { name: "Classification", order: 12, status: "active" },
              { name: "Data Sufficiency", order: 13, status: "active" },
              { name: "Arithmetic Reasoning", order: 14, status: "active" },
              { name: "Verification of Truth", order: 15, status: "active" }
            ]
          }
        ]
      },
      {
        name: "Non Verbal Reasoning",
        order: 6,
        status: "active",
        subCategories: [
          {
            name: "Visual Logic",
            order: 1,
            status: "active",
            topics: [
              { name: "Series", order: 1, status: "active" },
              { name: "Analogy", order: 2, status: "active" },
              { name: "Classification", order: 3, status: "active" },
              { name: "Analytical Reasoning", order: 4, status: "active" },
              { name: "Mirror Images", order: 5, status: "active" },
              { name: "Water Images", order: 6, status: "active" },
              { name: "Embedded Images", order: 7, status: "active" },
              { name: "Pattern Completion", order: 8, status: "active" },
              { name: "Figure Matrix", order: 9, status: "active" },
              { name: "Paper Folding", order: 10, status: "active" },
              { name: "Paper Cutting", order: 11, status: "active" },
              { name: "Rule Detection", order: 12, status: "active" },
              { name: "Grouping of Images", order: 13, status: "active" },
              { name: "Dot Situation", order: 14, status: "active" },
              { name: "Shape Construction", order: 15, status: "active" },
              { name: "Image Analysis", order: 16, status: "active" },
              { name: "Cubes and Dice", order: 17, status: "active" }
            ]
          }
        ]
      },
      {
        name: "Current Affairs Categories",
        order: 7,
        status: "active",
        subCategories: [
          {
            name: "Current Affairs",
            order: 1,
            status: "active",
            topics: [
              { name: "Agriculture", order: 1, status: "active" },
              { name: "Art and Culture", order: 2, status: "active" },
              { name: "Awards and Honours", order: 3, status: "active" },
              { name: "Banking", order: 4, status: "active" },
              { name: "Bills and Acts", order: 5, status: "active" },
              { name: "Business", order: 6, status: "active" },
              { name: "Defence", order: 7, status: "active" },
              { name: "Economy", order: 8, status: "active" },
              { name: "Education", order: 9, status: "active" },
              { name: "Environment", order: 10, status: "active" },
              { name: "Finance", order: 11, status: "active" },
              { name: "Important Days", order: 12, status: "active" },
              { name: "International", order: 13, status: "active" },
              { name: "National", order: 14, status: "active" },
              { name: "Politics", order: 15, status: "active" },
              { name: "Science", order: 16, status: "active" },
              { name: "Sports", order: 17, status: "active" },
              { name: "Technology", order: 18, status: "active" },
              { name: "Miscellaneous", order: 19, status: "active" }
            ]
          }
        ]
      },
      {
        name: "General Knowledge",
        order: 8,
        status: "active",
        subCategories: [
          {
            name: "General Awareness",
            order: 1,
            status: "active",
            topics: [
              { name: "Indian History", order: 1, status: "active" },
              { name: "Indian Geography", order: 2, status: "active" },
              { name: "Indian Politics", order: 3, status: "active" },
              { name: "Indian Economy", order: 4, status: "active" },
              { name: "General Science", order: 5, status: "active" },
              { name: "Physics", order: 6, status: "active" },
              { name: "Chemistry", order: 7, status: "active" },
              { name: "Biology", order: 8, status: "active" },
              { name: "Sports", order: 9, status: "active" },
              { name: "Books and Authors", order: 10, status: "active" },
              { name: "Technology", order: 11, status: "active" },
              { name: "Awards", order: 12, status: "active" },
              { name: "Famous Personalities", order: 13, status: "active" }
            ]
          }
        ]
      },
      {
        name: "Company Wise Preparation",
        order: 9,
        status: "active",
        subCategories: [
          {
            name: "Mass Recruiters",
            order: 1,
            status: "active",
            topics: [
              { name: "TCS NQT", order: 1, status: "active" },
              { name: "Infosys", order: 2, status: "active" },
              { name: "Wipro", order: 3, status: "active" },
              { name: "Accenture", order: 4, status: "active" },
              { name: "Cognizant", order: 5, status: "active" },
              { name: "Capgemini", order: 6, status: "active" },
              { name: "HCL", order: 7, status: "active" },
              { name: "Tech Mahindra", order: 8, status: "active" },
              { name: "IBM", order: 9, status: "active" },
              { name: "Deloitte", order: 10, status: "active" }
            ]
          }
        ]
      }
    ];

    // Seed PrepCategory if empty
    const catCount = await PrepCategory.countDocuments();
    if (catCount === 0) {
      await PrepCategory.insertMany(defaultCategories);
      console.log('✅ Seeded default categories tree structure');
    } else {
      console.log(`ℹ   PrepCategory: ${catCount} docs already exist, skipping.`);
    }

    // Seed Aptitude Questions if empty to avoid changing question ObjectIds and losing associated comments
    const aptCount = await AptitudeQuestion.countDocuments();
    if (aptCount === 0) {
      console.log('🧹 Database empty. Generating Aptitude questions...');
      
      const generatedAptitudeQuestions = [];
      const generatedKeys = new Set();

      // 1. First generate the standard 36 aptitude topics under category "Aptitude"
      for (const topic of ALL_TOPICS) {
        const qs = generateQuestionsForTopicAndCategory("Aptitude", topic);
        generatedAptitudeQuestions.push(...qs);
        generatedKeys.add(`aptitude::${topic.toLowerCase()}`);
      }

      // 2. Next, generate questions for all active topics in PrepCategory that are not yet covered
      const mappings = {
        "HCF and LCM": "Problems on H.C.F and L.C.M",
        "Averages": "Average",
        "Alligation and Mixture": "Alligation or Mixture",
        "Percentages": "Percentage",
        "Time Speed Distance": "Time and Distance",
        "Logarithms": "Logarithm",
        "Mensuration": "Area"
      };

      for (const cat of defaultCategories) {
        const catName = cat.name;
        if (catName === "Company Wise Preparation") continue;

        // Map category name to backend expectations
        let backendCat = catName;
        if (catName === "Quantitative Aptitude") {
          backendCat = "Aptitude";
        }

        for (const sub of cat.subCategories) {
          if (sub.status !== 'active') continue;
          for (const top of sub.topics) {
            if (top.status !== 'active') continue;

            const topicName = top.name;
            const mappedName = mappings[topicName] || topicName;

            const key = `${backendCat.toLowerCase()}::${mappedName.toLowerCase()}`;
            if (!generatedKeys.has(key)) {
              const qs = generateQuestionsForTopicAndCategory(backendCat, mappedName);
              generatedAptitudeQuestions.push(...qs);
              generatedKeys.add(key);
            }
          }
        }
      }
      
      await AptitudeQuestion.insertMany(generatedAptitudeQuestions);
      console.log(`✅ Seeded ${generatedAptitudeQuestions.length} Aptitude questions across all categories and topics`);
    } else {
      console.log(`ℹ   AptitudeQuestion: ${aptCount} docs already exist, skipping.`);
    }

    if (techCount === 0) {
      await TechnicalQuestion.insertMany(technicalQuestions);
      console.log(`✅ Seeded ${technicalQuestions.length} Technical questions`);
    } else {
      console.log(`ℹ   Technical: ${techCount} docs already exist, skipping.`);
    }

    if (dsaCount === 0) {
      await DSAQuestion.insertMany(dsaQuestions);
      console.log(`✅ Seeded ${dsaQuestions.length} DSA questions`);
    } else {
      console.log(`ℹ   DSA: ${dsaCount} docs already exist, skipping.`);
    }

    if (compCount === 0) {
      await CompanyPrep.insertMany(companyPrep);
      console.log(`✅ Seeded ${companyPrep.length} Company Prep items`);
    } else {
      console.log(`ℹ   CompanyPrep: ${compCount} docs already exist, skipping.`);
    }

    if (govCount === 0) {
      await GovPrep.insertMany(govPrep);
      console.log(`✅ Seeded ${govPrep.length} Gov Prep items`);
    } else {
      console.log(`ℹ   GovPrep: ${govCount} docs already exist, skipping.`);
    }

    if (mockCount === 0) {
      await MockTest.insertMany(mockTests);
      console.log(`✅ Seeded ${mockTests.length} Mock Tests`);
    } else {
      console.log(`ℹ   MockTest: ${mockCount} docs already exist, skipping.`);
    }

    // Seed PrepCompany if empty
    const compCount2 = await PrepCompany.countDocuments();
    if (compCount2 === 0) {
      const defaultCompanies = [
        { name: "TCS NQT", order: 1, status: "active" },
        { name: "Infosys", order: 2, status: "active" },
        { name: "Wipro", order: 3, status: "active" },
        { name: "Accenture", order: 4, status: "active" },
        { name: "Cognizant", order: 5, status: "active" },
        { name: "Capgemini", order: 6, status: "active" },
        { name: "HCL", order: 7, status: "active" },
        { name: "Tech Mahindra", order: 8, status: "active" },
        { name: "IBM", order: 9, status: "active" },
        { name: "Deloitte", order: 10, status: "active" }
      ];
      await PrepCompany.insertMany(defaultCompanies);
      console.log('✅ Seeded default companies list');
    } else {
      console.log(`ℹ   PrepCompany: ${compCount2} docs already exist, skipping.`);
    }

    console.log('🎉 Prep data seeding complete!');
  } catch (err) {
    console.error('⚠️  seedPrepData error:', err.message);
  }
}

// ─── STANDALONE RUNNER (only when called directly via node) ───────────────────
if (require.main === module) {
  (async () => {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB (standalone seed)');
    await seedPrepData();
    await mongoose.disconnect();
    console.log('✅ Disconnected. Done.');
  })().catch(err => { console.error(err); process.exit(1); });
}

module.exports = { seedPrepData };
