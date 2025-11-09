import { useQuery } from "@tanstack/react-query";
import { Badge, IconButton } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Link from "next/link";
import axios from "@/services/axios";

async function fetchAlertCount() {
  const res = await axios.get("/alerts/count");
  return res.data;
}

export const AlertBadge = () => {
  const { data,   } = useQuery({
    queryKey: ["/alerts/count"],
    queryFn: fetchAlertCount,
    staleTime: 0, 
    refetchOnMount: true, 
 
  });

  return (
    <Link href="/stock/alerts">
      <IconButton color="inherit">
        <Badge badgeContent={data?.unread || 0} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
    </Link>
  );
};
