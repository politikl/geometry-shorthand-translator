import React, { useState } from 'react';
import { ArrowRight, Copy, Check } from 'lucide-react';

const GeometryShorthandTranslator = () => {
  const [input, setInput] = useState('');
  const [translations, setTranslations] = useState([]);
  const [copied, setCopied] = useState(false);
  const [tipIndex, setTipIndex] = useState(0);
  const [fadeIn, setFadeIn] = useState(true);

  const tips = [
    { icon: '\\\\...\\\\', text: 'Use / to separate statements' },
    { icon: 'P:A,B,C', text: 'Use commas to construct multiple points at once' },
    { icon: '[ABC]', text: 'Use square brackets for area calculations' },
    { icon: 'P:D.AB', text: 'Use a dot to place points on objects' },
    { icon: '∠ABC=90', text: 'Use ∠ or < for angles' },
    { icon: 'R:3;AB=ABC', text: 'Construct regular polygons with R:n' },
    { icon: 'AB*PR', text: 'Use * to check properties or relationships' },
    { icon: '\\?', text: 'Use \\? to request a proof' },
    { icon: '|', text: 'Use | to add conditions to constructions' },
    { icon: '_LC, _PT', text: 'Cite theorems with underscore notation' }
  ];

  React.useEffect(() => {
    const interval = setInterval(() => {
      setFadeIn(false);
      setTimeout(() => {
        setTipIndex((prev) => (prev + 1) % tips.length);
        setFadeIn(true);
      }, 300);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const properties = {
    'R': 'regular', 'CV': 'convex', 'CC': 'concave',
    'RT': 'right', 'OB': 'obtuse', 'AC': 'acute',
    'SC': 'scalene', 'IS': 'isosceles', 'TR': 'trapezoid',
    'PL': 'parallelogram', 'EQ': 'equilateral',
    'EA': 'equiangular', 'C': 'cyclic', 'TP': 'tangential'
  };

  const relationships = {
    'S': 'collinear', 'P': 'parallel', '∥': 'parallel',
    'PR': 'perpendicular', '⊥': 'perpendicular',
    'CG': 'congruent', '≅': 'congruent',
    'SM': 'similar', '~': 'similar'
  };

  const theorems = {
    '_TI': 'Triangle Inequality', '_ST': 'Stewart\'s Theorem', '_AT': 'Apollonius Theorem',
    '_VT': 'Viviani\'s Theorem', '_NP': 'Napoleon\'s Theorem', '_EL': 'Euler Line',
    '_9C': 'Nine-Point Circle', '_SL': 'Simson Line', '_CV': 'Ceva\'s Theorem',
    '_ML': 'Menelaus\' Theorem', '_AB': 'Angle Bisector Theorem', '_IE': 'Incenter-Excenter Lemma',
    '_CT': 'Carnot\'s Theorem', '_M': 'Miquel\'s Theorem', '_ET': 'Euler\'s Theorem',
    '_DT': 'Desargue\'s Theorem', '_HF': 'Heron\'s Formula', '_QF': 'Bretschinder\'s Formula',
    '_BF': 'Brahmagupta\'s Formula', '_JT': 'Japanese Theorem', '_NT': 'Newton\'s Theorem',
    '_PT': 'Ptolemy\'s Theorem', '_PP': 'Power of a Point Theorem', '_BT': 'Butterfly Theorem',
    '_PC': 'Pascal\'s Theorem', '_LC': 'Law of Cosines', '_LS': 'Law of Sines',
    '_LT': 'Law of Tangents', '_PK': 'Pick\'s Theorem', '_SH': 'Shoelace Theorem',
    '_SSC': 'SSS Congruence', '_SAC': 'SAS Congruence', '_SSA': 'SSA Congruence',
    '_ASA': 'ASA Congruence', '_AAS': 'AAS Congruence', '_HL': 'HL Congruence',
    '_AA': 'AA Similarity', '_SAS': 'SAS Similarity', '_SSS': 'SSS Similarity'
  };

  const constants = {
    '\\T': 'τ (tau)', 'τ': 'tau',
    '\\P': 'π (pi)', 'π': 'pi',
    '\\G': 'φ (phi)', 'φ': 'phi'
  };

  const translateStatement = (stmt) => {
    stmt = stmt.trim();
    if (!stmt) return '';
    
    // Don't process constants if this looks like a construction command
    // (e.g., P:A should not trigger \P -> pi replacement)
    const isConstant = (code) => {
      // Only treat as constant if it's not followed by a colon (construction marker)
      const nextChar = stmt[stmt.indexOf(code) + code.length];
      return nextChar !== ':';
    };

    // Handle casework - need to parse the entire casework block
    if (stmt.includes('<<') || stmt.includes('>>')) {
      // Extract main statement and casework
      const mainMatch = stmt.match(/^([^<]+)<<(.+)>>$/);
      if (mainMatch) {
        const [, mainStmt, casework] = mainMatch;
        const mainTranslation = translateStatement(mainStmt.trim());
        
        // Parse individual cases: 1(A:..., ...), 2(A:..., ...)
        const cases = [];
        const caseRegex = /(\d+)\(A:([^,]+),([^)]+)\)/g;
        let match;
        
        while ((match = caseRegex.exec(casework)) !== null) {
          const [, caseNum, explanation, result] = match;
          cases.push(`  Case ${caseNum}: When ${explanation.trim()}, then ${result.trim()}.`);
        }
        
        if (cases.length > 0) {
          return `${mainTranslation}\nCasework:\n${cases.join('\n')}`;
        }
        return mainTranslation;
      }
      
      // Fallback for partial casework syntax
      if (stmt.includes('<<')) {
        return 'Begin casework analysis.';
      }
      if (stmt.includes('\\>>') || stmt.includes('>>')) {
        return 'End casework.';
      }
    }

    // Handle proof markers
    if (stmt.startsWith('\\p:')) {
      const content = stmt.slice(3);
      return `We will prove: ${translateStatement(content)}`;
    }
    if (stmt.startsWith('\\pC:')) {
      const content = stmt.slice(4);
      return `We will prove by contradiction: ${translateStatement(content)}`;
    }
    if (stmt === '\\q' || stmt === '□') return 'And that is what was to be shown.';
    if (stmt === '\\qC' || stmt === '↯') return 'Achieving a contradiction.';
    if (stmt === '\\bc' || stmt === '∵') return 'Because';
    if (stmt === '\\th' || stmt === '∴') return 'Therefore';

    // Handle logic operators
    if (stmt.includes('||') || stmt.includes('∨')) {
      stmt = stmt.replace(/\|\||∨/g, ' or ');
    }
    if (stmt.includes('&&') || stmt.includes('∧')) {
      stmt = stmt.replace(/&&|∧/g, ' and ');
    }
    if (stmt.includes('=>') || stmt.includes('⊃')) {
      stmt = stmt.replace(/=>|⊃/g, ' implies ');
    }
    if (stmt.includes('|A') || stmt.includes('∀')) {
      stmt = stmt.replace(/\|A|∀/g, 'for all ');
    }
    if (stmt.includes('|E') || stmt.includes('∃')) {
      stmt = stmt.replace(/\|E|∃/g, 'there exists ');
    }

    // Handle inequalities
    stmt = stmt.replace(/!=/g, '≠').replace(/≠/g, ' does not equal ');
    stmt = stmt.replace(/>=/g, '≥').replace(/≥/g, ' is greater than or equal to ');
    stmt = stmt.replace(/<=/g, '≤').replace(/≤/g, ' is less than or equal to ');

    // Handle theorem citations
    for (const [code, name] of Object.entries(theorems)) {
      if (stmt.includes(code)) {
        stmt = stmt.replace(code, `[by ${name}]`);
      }
    }

    // Handle constants - but only if not followed by colon
    for (const [code, name] of Object.entries(constants)) {
      if (stmt.includes(code)) {
        const index = stmt.indexOf(code);
        const nextChar = stmt[index + code.length];
        // Only replace if NOT followed by a colon (which would make it a construction)
        if (nextChar !== ':') {
          stmt = stmt.replace(new RegExp(code.replace(/\\/g, '\\\\'), 'g'), name);
        }
      }
    }

    // Graph construction: G:{equation}
    if (stmt.startsWith('G:')) {
      const eq = stmt.slice(2).replace(/[{}]/g, '');
      return `Graph the function ${eq}.`;
    }

    // Point construction with multiple points: P:A,B,C
    if (stmt.startsWith('P:') && stmt.includes(',') && !stmt.includes('.') && !stmt.includes('|')) {
      const points = stmt.slice(2).split(',').join(', ');
      return `Construct points ${points}.`;
    }

    // Point construction: P:A or P:B.CD or P:E=ABxCD
    if (stmt.startsWith('P:')) {
      const rest = stmt.slice(2);
      
      // Intersection: P:E=ABxCD
      if (rest.includes('x') && rest.includes('=')) {
        const [point, intersection] = rest.split('=');
        const [obj1, obj2] = intersection.split('x');
        return `Let point ${point} be the intersection of ${obj1} and ${obj2}.`;
      }
      
      // Point on object with condition: P:C.AB|AC=3 or P:D.AC|R:3;AD=ADE,[ADE]=20 or P:H.AB|DFH*R
      if (rest.includes('.') && rest.includes('|')) {
        const [pointObj, conditions] = rest.split('|');
        const [point, obj] = pointObj.split('.');
        
        // Split conditions by comma
        const condParts = conditions.split(',').map(c => c.trim());
        
        let condStr = condParts.map(c => {
          // Handle construction commands within conditions (like R:3;AD=ADE)
          if (c.startsWith('R:')) {
            const rest = c.slice(2);
            const [n, segPoly] = rest.split(';');
            if (segPoly && segPoly.includes('=')) {
              const [seg, poly] = segPoly.split('=');
              const shapeNames = { 
                '3': 'equilateral triangle', 
                '4': 'square', 
                '5': 'regular pentagon', 
                '6': 'regular hexagon',
                '8': 'regular octagon'
              };
              return `${shapeNames[n] || `regular ${n}-gon`} ${poly} with side ${seg}`;
            }
          }
          if (c.startsWith('P:') || c.startsWith('S:') || c.startsWith('L:') || c.startsWith('C:')) {
            const translation = translateStatement(c);
            return translation.charAt(0).toLowerCase() + translation.slice(1);
          }
          if (c.startsWith('J:')) {
            const points = c.slice(2);
            if (points.includes('*')) {
              const [poly, prop] = points.split('*');
              const propName = properties[prop] || relationships[prop] || prop;
              return `polygon ${poly} is ${propName}`;
            }
            return `polygon ${points}`;
          }
          // Handle property checks (like DFH*R)
          if (c.includes('*')) {
            const [obj, prop] = c.split('*');
            const propName = properties[prop] || relationships[prop] || prop;
            return `${obj} is ${propName}`;
          }
          // Handle area/perimeter assignments
          if (c.includes('[') && c.includes(']') && c.includes('=')) {
            const match = c.match(/\[([^\]]+)\]=(.+)/);
            if (match) {
              return `the area of ${match[1]} is ${match[2]}`;
            }
          }
          if (c.includes('(') && c.includes(')') && c.includes('=')) {
            const match = c.match(/\(([^)]+)\)=(.+)/);
            if (match) {
              return `the perimeter of ${match[1]} is ${match[2]}`;
            }
          }
          // Handle simple equalities
          if (c.includes('=') && !c.includes('*')) {
            const [left, right] = c.split('=');
            return `${left.trim()} equals ${right.trim()}`;
          }
          // Handle coordinates
          if (c.includes('{')) {
            return `at coordinates ${c}`;
          }
          return c;
        }).join(', ');
        
        return `Construct point ${point} on ${obj} such that ${condStr}.`;
      }
      
      // Point on object: P:C.AB
      if (rest.includes('.')) {
        const [point, obj] = rest.split('.');
        return `Construct point ${point} on ${obj}.`;
      }
      
      // Point with coordinates: P:A|{(0,0)}
      if (rest.includes('{')) {
        const [point, coords] = rest.split('|');
        return `Let point ${point} be at ${coords}.`;
      }
      
      // Simple point: P:A
      return `Construct point ${rest}.`;
    }

    // Segment: S:AB or S:AB,CD
    if (stmt.startsWith('S:')) {
      const segs = stmt.slice(2);
      
      // Check if this is malformed (like S:DFP:H which should be S:DF/P:H)
      if (segs.match(/^[A-Z]{2,}P:/)) {
        // Looks like two statements got concatenated, try to split
        const match = segs.match(/^([A-Z]+)(P:.+)$/);
        if (match) {
          return `Connect segment ${match[1]}. [Note: "${match[2]}" appears to be a separate statement]`;
        }
      }
      
      // Check if it's actually multiple segments separated by comma
      if (segs.includes(',') && !segs.includes('.') && !segs.includes('|')) {
        const segList = segs.split(',').map(s => s.trim()).filter(s => s.length === 2 || s.length === 3);
        if (segList.length > 1) {
          return `Connect segments ${segList.join(', ')}.`;
        }
      }
      return `Connect segment ${segs}.`;
    }

    // Line: L:AB
    if (stmt.startsWith('L:')) {
      return `Connect line ${stmt.slice(2)}.`;
    }

    // Ray: W:AB
    if (stmt.startsWith('W:')) {
      return `Construct ray ${stmt.slice(2)}.`;
    }

    // Circle constructions
    if (stmt.startsWith('C:')) {
      const rest = stmt.slice(2);
      const parts = rest.split(';');
      
      if (parts.length === 3) {
        return `Construct a circle through points ${parts[0]}, ${parts[1]}, and ${parts[2]}.`;
      }
      if (parts.length === 2) {
        if (/^\d+$/.test(parts[1])) {
          return `Construct a circle with center ${parts[0]} and radius ${parts[1]}.`;
        }
        return `Construct a circle with center ${parts[0]} passing through point ${parts[1]}.`;
      }
    }

    // Polygon: J:ABCD
    if (stmt.startsWith('J:')) {
      const points = stmt.slice(2);
      if (points.includes('*')) {
        const [poly, prop] = points.split('*');
        const propName = properties[prop] || prop;
        return `Construct ${propName} polygon ${poly}.`;
      }
      return `Construct polygon ${points}.`;
    }

    // Regular polygon: R:3;AB=ABC
    if (stmt.startsWith('R:')) {
      const rest = stmt.slice(2);
      const [n, segPoly] = rest.split(';');
      if (segPoly && segPoly.includes('=')) {
        const [seg, poly] = segPoly.split('=');
        const shapeNames = { 
          '3': 'equilateral triangle', 
          '4': 'square', 
          '5': 'regular pentagon', 
          '6': 'regular hexagon',
          '8': 'regular octagon'
        };
        return `Construct ${shapeNames[n] || `regular ${n}-gon`} ${poly} with side ${seg}.`;
      }
    }

    // Area: [ABC]=x
    if (stmt.includes('[') && stmt.includes(']')) {
      const match = stmt.match(/\[([^\]]+)\](.*)$/);
      if (match) {
        const obj = match[1];
        const rest = match[2];
        if (rest.startsWith('=')) {
          return `Let the area of ${obj} be ${rest.slice(1)}.`;
        }
        if (rest === '?') {
          return `What is the area of ${obj}?`;
        }
      }
    }

    // Perimeter/Distance: (ABC)=x
    if (stmt.includes('(') && stmt.includes(')')) {
      const match = stmt.match(/\(([^)]+)\)(.*)$/);
      if (match) {
        const obj = match[1];
        const rest = match[2];
        if (rest.startsWith('=')) {
          return `Let the perimeter of ${obj} be ${rest.slice(1)}.`;
        }
        if (rest === '?') {
          return `What is the perimeter of ${obj}?`;
        }
      }
    }

    // Angle: <ABC=90 or ∠ABC=90
    if (stmt.includes('<') || stmt.includes('∠')) {
      const rest = stmt.replace('<', '').replace('∠', '');
      if (rest.includes('=')) {
        const [angle, value] = rest.split('=');
        return `Angle ${angle} measures ${value} degrees.`;
      }
      if (rest.endsWith('?')) {
        return `What is the measure of angle ${rest.slice(0, -1)}?`;
      }
    }

    // Equality/Assignment: AB=x
    if (stmt.includes('=') && !stmt.includes('*') && !stmt.startsWith('R:')) {
      const [left, right] = stmt.split('=');
      if (right.trim() === '?') {
        return `What is the value of ${left.trim()}?`;
      }
      if (left.length <= 4 && right.length <= 4) {
        return `Let ${left.trim()} equal ${right.trim()}.`;
      }
      return `${left.trim()} equals ${right.trim()}.`;
    }

    // Property check: ABC*IS? or DFH*R (without ?)
    if (stmt.includes('*') && !stmt.includes(';')) {
      const hasPipe = stmt.includes('|');
      if (hasPipe) {
        // This is part of a larger construction, don't process here
        return stmt;
      }
      
      if (stmt.endsWith('?')) {
        const [obj, prop] = stmt.slice(0, -1).split('*');
        const propName = properties[prop] || relationships[prop] || prop;
        return `Is ${obj} ${propName}?`;
      } else {
        // Property assertion without question mark
        const [obj, prop] = stmt.split('*');
        const propName = properties[prop] || relationships[prop] || prop;
        return `${obj} is ${propName}.`;
      }
    }

    // Relationship check: AB;BC*PR?
    if (stmt.includes(';') && stmt.includes('*') && stmt.endsWith('?')) {
      const [objs, rel] = stmt.slice(0, -1).split('*');
      const parts = objs.split(';');
      const relName = relationships[rel] || rel;
      return `Are ${parts.join(' and ')} ${relName}?`;
    }

    // Proof query: AB=BC\?
    if (stmt.includes('\\?')) {
      const content = stmt.replace('\\?', '');
      return `Prove that ${content}.`;
    }

    // Question: ?
    if (stmt.endsWith('?')) {
      return `What is ${stmt.slice(0, -1)}?`;
    }

    return stmt;
  };

  const translate = () => {
    let text = input.trim();
    
    // Remove outer shorthand markers
    if (text.startsWith('\\\\') && text.endsWith('\\\\')) {
      text = text.slice(2, -2);
    }
    
    // Split by / delimiter
    const statements = text.split('/').map(s => s.trim()).filter(s => s);
    
    const results = statements.map((stmt, idx) => ({
      original: stmt,
      translation: translateStatement(stmt),
      index: idx + 1
    }));
    
    setTranslations(results);
  };

  const copyAll = () => {
    const text = translations.map(t => t.translation).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Card */}
        <div className="bg-white rounded-xl shadow-md p-6 md:p-8 mb-6 border border-gray-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center shadow">
              <span className="text-2xl font-bold text-white">G</span>
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                Geometry Shorthand Translator
              </h1>
              <p className="text-gray-600 text-sm md:text-base mt-1">Transform concise notation into clear English</p>
            </div>
          </div>
        </div>

        {/* Main Translator Card */}
        <div className="bg-white rounded-xl shadow-md p-6 md:p-8 border border-gray-200">
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Shorthand Input
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Example: \\P:A,B/S:AB/R:3;AB=ABC/[ABC]?\\"
              className="w-full h-40 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-none font-mono text-sm bg-white"
            />
            <p className={`text-xs text-gray-500 mt-2 flex items-center gap-2 transition-opacity duration-300 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
              <span className="font-mono bg-gray-100 px-2 py-1 rounded text-gray-700">{tips[tipIndex].icon}</span> 
              <span>{tips[tipIndex].text}</span>
            </p>
          </div>
          
          <button
            onClick={translate}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 shadow-sm"
          >
            <ArrowRight size={20} />
            <span>Translate</span>
          </button>
          
          {translations.length > 0 && (
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                  Translation Results
                </h2>
                <button
                  onClick={copyAll}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200 border border-gray-200"
                >
                  {copied ? <Check size={16} className="text-green-600" /> : <Copy size={16} className="text-gray-600" />}
                  <span className="text-sm font-medium">{copied ? 'Copied!' : 'Copy All'}</span>
                </button>
              </div>
              
              <div className="space-y-3">
                {translations.map((item) => (
                  <div key={item.index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-lg flex items-center justify-center font-semibold text-sm">
                        {item.index}
                      </div>
                      <div className="flex-grow">
                        <div className="text-xs font-mono text-gray-600 mb-2 bg-white px-3 py-1.5 rounded border border-gray-200 inline-block">
                          {item.original}
                        </div>
                        <div className="text-gray-800 leading-relaxed">{item.translation}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Quick Reference Card */}
        <div className="mt-6 bg-white rounded-xl shadow-md p-5 md:p-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Quick Reference
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 text-xs">
            <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-200">
              <span className="font-mono font-bold text-indigo-600">P:</span>
              <span className="ml-1.5 text-gray-700">Point</span>
            </div>
            <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-200">
              <span className="font-mono font-bold text-indigo-600">S:</span>
              <span className="ml-1.5 text-gray-700">Segment</span>
            </div>
            <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-200">
              <span className="font-mono font-bold text-indigo-600">L:</span>
              <span className="ml-1.5 text-gray-700">Line</span>
            </div>
            <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-200">
              <span className="font-mono font-bold text-indigo-600">C:</span>
              <span className="ml-1.5 text-gray-700">Circle</span>
            </div>
            <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-200">
              <span className="font-mono font-bold text-indigo-600">R:</span>
              <span className="ml-1.5 text-gray-700">Regular</span>
            </div>
            <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-200">
              <span className="font-mono font-bold text-indigo-600">G:</span>
              <span className="ml-1.5 text-gray-700">Graph</span>
            </div>
            <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-200">
              <span className="font-mono font-bold text-indigo-600">[ABC]</span>
              <span className="ml-1.5 text-gray-700">Area</span>
            </div>
            <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-200">
              <span className="font-mono font-bold text-indigo-600">(ABC)</span>
              <span className="ml-1.5 text-gray-700">Perimeter</span>
            </div>
            <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-200">
              <span className="font-mono font-bold text-indigo-600">∠</span>
              <span className="ml-1.5 text-gray-700">Angle</span>
            </div>
            <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-200">
              <span className="font-mono font-bold text-indigo-600">?</span>
              <span className="ml-1.5 text-gray-700">Question</span>
            </div>
            <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-200">
              <span className="font-mono font-bold text-indigo-600">\?</span>
              <span className="ml-1.5 text-gray-700">Prove</span>
            </div>
            <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-200">
              <span className="font-mono font-bold text-indigo-600">,</span>
              <span className="ml-1.5 text-gray-700">Multiple</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <div className="bg-white rounded-xl shadow-md p-4 border border-gray-200 inline-block">
            <p className="text-sm text-gray-600 mb-2">
              <span className="font-semibold text-gray-800">Created by the</span>{' '}
              <span className="text-indigo-600 font-medium">Geometry Shorthand Language Team</span>
            </p>
            <a 
              href="https://tinyurl.com/geoshorthand" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-200 underline"
            >
              📚 View Full Documentation
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeometryShorthandTranslator;
