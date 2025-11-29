import { ProfileMenu } from "@/components/profile/ProfileMenu";

export default function ProfilePage() {
  return <ProfileMenu />;
}
const [user, setUser] = useState(null);

useEffect(() => {
  const load = async () => {
    try {
      const res = await api.get("/auth/me");
      setUser(res.data);
    } catch (e) {
      router.push("/auth/login");
    }
  };
  load();
}, []);
