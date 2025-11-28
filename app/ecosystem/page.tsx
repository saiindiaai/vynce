export default function EcosystemPage() {
  return (
    <div>

      {/* Profile Card */}

useEffect(() => {
  const loadUser = async () => {
    try {
      const res = await api.get("/auth/me");
      setUser(res.data);
    } catch (err) {
      console.log("Not authenticated");
      router.push("/auth/login");
    }
  };

  loadUser();
}, []);

      <div className="mb-8">
        <div className="bg-gradient-to-br from-pink-500 via-purple-600 to-indigo-600 p-[2px] rounded-3xl">
          <div className="card-matte rounded-3xl p-5 flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xl font-bold">
              VS
            </div>
            <div>
              <h2 className="text-xl font-bold">VYNCE USER</h2>
              <p className="text-sm text-gray-300">Level 12 • Starter Tier</p>
            </div>
          </div>
        </div>
      </div>

      {/* Orbits */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Your Orbits</h3>
        <div className="flex gap-4">
          <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-2xl text-gray-300">
            +
          </div>

          <div className="w-20 h-20 bg-gradient-to-br from-indigo-600 to-purple-500 rounded-xl relative">
            <span className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 rounded-full"></span>
          </div>

          <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-orange-400 rounded-xl relative">
            <span className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 rounded-full"></span>
          </div>
        </div>
      </div>

      {/* Core Apps */}
      <h3 className="text-lg font-semibold mb-4">Core Apps</h3>

      <div className="space-y-4">
        <div className="card-matte p-4 rounded-2xl border border-white/10 flex justify-between items-center">
          <div>
            <h4 className="font-semibold">Vynce Social</h4>
            <p className="text-gray-400 text-sm">Connect & Share</p>
          </div>
          <span className="text-green-400">95%</span>
        </div>

        <div className="card-matte p-4 rounded-2xl border border-white/10 flex justify-between items-center">
          <div>
            <h4 className="font-semibold">Vynce Connect</h4>
            <p className="text-gray-400 text-sm">Network Hub</p>
          </div>
          <span className="text-green-400">92%</span>
        </div>

        <div className="card-matte p-4 rounded-2xl border border-white/10 flex justify-between items-center">
          <div>
            <h4 className="font-semibold">Vynce AI</h4>
            <p className="text-gray-400 text-sm">Smart Assistant</p>
          </div>
          <span className="text-green-400">98%</span>
        </div>
      </div>
    </div>
  );
}
