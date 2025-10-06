# Geometry Shorthand Translator

A web-based tool to translate geometry shorthand notation into plain English. Perfect for students, teachers, and anyone working with geometric constructions and proofs.

## 🌐 Live Demo

**[Try it here!](https://politikl.github.io/geometry-shorthand-translator)**

## 📝 What is Geometry Shorthand?

Geometry shorthand is a concise notation system for describing geometric constructions, problems, and proofs. Instead of writing lengthy descriptions, you can use compact symbols and operators.

### Example

**Shorthand:**
```
\\P:A/P:B/S:AB/R:3;AB=ABC/[ABC]?\\
```

**Translation:**
1. Construct point A.
2. Construct point B.
3. Connect segment AB.
4. Construct equilateral triangle ABC with side AB.
5. What is the area of ABC?

## ✨ Features

- **Line-by-line translation** - Each shorthand statement is translated separately
- **Support for all major constructions** - Points, segments, lines, circles, polygons
- **Handles complex notation** - Areas, perimeals, angles, intersections, conditions
- **Theorem citations** - Recognizes common geometric theorems
- **Copy functionality** - Easily copy all translations at once
- **Quick reference guide** - Built-in reminder of common symbols

## 🚀 Usage

1. Enter your geometry shorthand in the input box
2. Use `/` to separate individual statements
3. Wrap your input in `\\` markers (optional)
4. Click "Translate"
5. View line-by-line translations

### Supported Notation

#### Constructions
- `P:A` - Construct point A
- `S:AB` - Connect segment AB
- `L:AB` - Connect line AB
- `C:A;5` - Circle with center A and radius 5
- `R:3;AB=ABC` - Equilateral triangle ABC with side AB

#### Measurements
- `[ABC]=20` - Area of ABC is 20
- `(ABC)=x` - Perimeter of ABC is x
- `<ABC=90` - Angle ABC is 90 degrees
- `AB=5` - Length of AB is 5

#### Special Operators
- `.` - On (e.g., `P:C.AB` = point C on AB)
- `x` - Intersection (e.g., `P:E=ABxCD`)
- `|` - Such that / conditions
- `?` - Question
- `*` - Properties (e.g., `ABC*IS?` = Is ABC isosceles?)

#### Proofs
- `\\p{...}` - We will prove
- `\\q` - QED (what was to be shown)
- `\\bc` - Because
- `\\th` - Therefore

## 🛠️ Built With

- **React** - Frontend framework
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **GitHub Pages** - Hosting

## 💻 Run Locally

```bash
# Clone the repository
git clone https://github.com/politikl/geometry-shorthand-translator.git

# Navigate to the project
cd geometry-shorthand-translator

# Install dependencies
npm install

# Start the development server
npm start
```

The app will open at `http://localhost:3000`

## 📦 Deploy

```bash
# Build and deploy to GitHub Pages
npm run deploy
```

---

Made with ❤️ for the geometry community
