import { Card, CardHeader, CardTitle, CardContent } from "./components/ui/card";

const services = [
  { name: "Text", url: "http://localhost:7861" },
  { name: "Vision", url: "http://localhost:7862" },
  { name: "Audio", url: "http://localhost:7863" },
  { name: "Tools", url: "http://localhost:7864" },
];

export default function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-4">
      {services.map((s) => (
        <a key={s.name} href={s.url} className="w-full max-w-sm">
          <Card>
            <CardHeader>
              <CardTitle>{s.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Open {s.name} demo</p>
            </CardContent>
          </Card>
        </a>
      ))}
    </div>
  );
}
