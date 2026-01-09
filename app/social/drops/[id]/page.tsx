
export default async function DropPage({ params }: { params: { id: string } }) {
  // TODO: Fetch drop by ID from backend
  // const drop = await fetchDropById(params.id);
  // if (!drop) return notFound();

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Drop Details</h1>
      {/* Render drop details here */}
      <div className="text-slate-400">Drop ID: {params.id}</div>
    </div>
  );
}
