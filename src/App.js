import React, { useState } from 'react';
import { ArrowRight, Copy, Check } from 'lucide-react';

const GeometryShorthandTranslator = () => {
  const [input, setInput] = useState('');
  const [translations, setTranslations] = useState([]);
  const [copied, setCopied] = useState(false);

  const properties = {
    'R': 'regular', 'CV': 'convex', 'CC': 'concave', 'T': 'triangle',
    'RT': 'right triangle', 'OB': 'obtuse triangle', 'AC': 'acute triangle',
    'SC': 'scalene triangle', 'IS': 'isosceles triangle', 'Q': 'quadrilateral',
    'TR': 'trapezoid', 'PL': 'parallelogram', 'EQ': 'equilateral',
    'EA': 'equiangular', 'C': 'cyclic', 'TP': 'tangential'
  };

  const relationships = {
    'S': 'collinear', 'P': 'parallel', 'PR': 'perpendicular',
    'CG': 'congruent', 'SM': 'similar'
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
    '_LT': 'Law of Tangents', '_PK': 'Pick\'s Theorem', '_SH': 'Shoelace Theorem'
  };

  const translateStatement = (stmt) => {
    stmt = stmt.trim();
    if (!stmt) return '';

    // Handle proof markers
    if (stmt.startsWith('\\p{')) {
      const content = stmt.slice(3, -1);
      return `We will prove: ${translateStatement(content)}`;
    }
    if (stmt.startsWith('\\pC{')) {
      const content = stmt.slice(4, -1);
      return `We will prove by contradiction: ${translateStatement(content)}`;
    }
    if (stmt === '\\q') return 'And that is what was to be shown.';
    if (stmt === '\\qC') return 'Achieving a contradiction.';
    if (stmt === '\\bc') return 'Because';
    if (stmt === '\\th') return 'Therefore';

    // Handle theorem citations
    for (const [code, name] of Object.entries(theorems)) {
      if (stmt.includes(code)) {
        stmt = stmt.replace(code, `[by ${name}]`);
      }
    }

    // Point construction: P:A or P:B.CD or P:E=ABxCD
    if (stmt.startsWith('P:')) {
      const rest = stmt.slice(2);
      
      // Intersection: P:E=ABxCD
      if (rest.includes('x')) {
        const [point, intersection] = rest.split('=');
        const [obj1, obj2] = intersection.split('x');
        return `Let point ${point} be the intersection of ${obj1} and ${obj2}.`;
      }
      
      // Point on object with condition: P:C.AB|AC=3
      if (rest.includes('.') && rest.includes('|')) {
        const [pointObj, conditions] = rest.split('|');
        const [point, obj] = pointObj.split('.');
        const condParts = conditions.split('|');
        let condStr = condParts.map(c => {
          if (c.includes('=')) {
            const [left, right] = c.split('=');
            return `${left} has length ${right}`;
          }
          if (c.includes('{')) {
            return `at coordinates ${c}`;
          }
          return c;
        }).join(' and ');
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

    // Segment: S:AB
    if (stmt.startsWith('S:')) {
      return `Connect segment ${stmt.slice(2)}.`;
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
      return `Construct polygon ${points}.`;
    }

    // Regular polygon: R:3;AB=ABC
    if (stmt.startsWith('R:')) {
      const rest = stmt.slice(2);
      const [n, segPoly] = rest.split(';');
      if (segPoly && segPoly.includes('=')) {
        const [seg, poly] = segPoly.split('=');
        const shapeNames = { '3': 'equilateral triangle', '4': 'square', '5': 'regular pentagon', '6': 'regular hexagon' };
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

    // Angle: <ABC=90
    if (stmt.includes('<')) {
      const rest = stmt.slice(stmt.indexOf('<') + 1);
      if (rest.includes('=')) {
        const [angle, value] = rest.split('=');
        return `Angle ${angle} measures ${value} degrees.`;
      }
      if (rest.endsWith('?')) {
        return `What is the measure of angle ${rest.slice(0, -1)}?`;
      }
    }

    // Equality/Assignment: AB=x
    if (stmt.includes('=') && !stmt.includes('*')) {
      const [left, right] = stmt.split('=');
      if (right === '?') {
        return `Does ${left} equal something?`;
      }
      if (left.length <= 3 && right.length <= 3) {
        return `Let ${left} equal ${right}.`;
      }
      return `${left} equals ${right}.`;
    }

    // Property check: ABC*IS?
    if (stmt.includes('*') && stmt.endsWith('?')) {
      const [obj, prop] = stmt.slice(0, -1).split('*');
      const propName = properties[prop] || relationships[prop] || prop;
      return `Is ${obj} ${propName}?`;
    }

    // Relationship check: AB;BC*PR?
    if (stmt.includes(';') && stmt.includes('*') && stmt.endsWith('?')) {
      const [objs, rel] = stmt.slice(0, -1).split('*');
      const [obj1, obj2] = objs.split(';');
      const relName = relationships[rel] || rel;
      return `Are ${obj1} and ${obj2} ${relName}?`;
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Geometry Shorthand Translator</h1>
          <p className="text-gray-600 mb-6">Enter geometry shorthand notation to translate it into plain English</p>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Shorthand Input
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Example: \\P:A/P:B/S:AB/R:3;AB=ABC/[ABC]?\\"
              className="w-full h-32 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none font-mono text-sm"
            />
          </div>
          
          <button
            onClick={translate}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center gap-2"
          >
            <ArrowRight size={20} />
            Translate
          </button>
          
          {translations.length > 0 && (
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Translation Results</h2>
                <button
                  onClick={copyAll}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition duration-200"
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  {copied ? 'Copied!' : 'Copy All'}
                </button>
              </div>
              
              <div className="space-y-3">
                {translations.map((item) => (
                  <div key={item.index} className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg p-4 border border-indigo-100">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                        {item.index}
                      </div>
                      <div className="flex-grow">
                        <div className="text-xs font-mono text-gray-500 mb-1">{item.original}</div>
                        <div className="text-gray-800">{item.translation}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="mt-6 bg-white rounded-lg shadow p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Quick Reference</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-gray-600">
            <div><span className="font-mono bg-gray-100 px-1 rounded">P:</span> Point</div>
            <div><span className="font-mono bg-gray-100 px-1 rounded">S:</span> Segment</div>
            <div><span className="font-mono bg-gray-100 px-1 rounded">L:</span> Line</div>
            <div><span className="font-mono bg-gray-100 px-1 rounded">C:</span> Circle</div>
            <div><span className="font-mono bg-gray-100 px-1 rounded">R:</span> Regular polygon</div>
            <div><span className="font-mono bg-gray-100 px-1 rounded">[ABC]</span> Area</div>
            <div><span className="font-mono bg-gray-100 px-1 rounded">(ABC)</span> Perimeter</div>
            <div><span className="font-mono bg-gray-100 px-1 rounded">?</span> Question</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeometryShorthandTranslator;