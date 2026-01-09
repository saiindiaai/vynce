
import { notFound } from "next/navigation";

async function fetchDropById(id: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001"}/api/social/drops/${id}`);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}


export default async function DropPage(props: { params: { id: string } }) {
  const { params } = await props;
  const id = params.id;
  if (!id) return notFound();
  const drop = await fetchDropById(id);
  if (!drop) return notFound();

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{drop.title || "Drop Details"}</h1>
      {drop.thumb && <img src={drop.thumb} alt={drop.title} className="w-full rounded-lg mb-4 max-h-80 object-cover" />}
      <div className="text-base text-slate-100 whitespace-pre-line mb-2">{drop.content || drop.title}</div>
      <div className="text-xs text-slate-400 mb-2">by {drop.user || drop.author?.username || "unknown"}</div>
      <div className="text-slate-400 mt-4">Drop ID: {id}</div>
    </div>
  );
}
