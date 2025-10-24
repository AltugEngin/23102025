import { supabase } from "@/supabaseClient";
import { columns, type Payment } from "./columns";
import { Spinner } from "@/components/ui/spinner";
import { Item, ItemContent, ItemMedia, ItemTitle } from "@/components/ui/item";

import { DataTable } from "./data-table";
import { useQuery } from "@tanstack/react-query";

const fetchPosts = async (): Promise<Payment[]> => {
  const { data } = await supabase.from("payment").select("*");
  return data as Payment[];
};

export default function Demo() {
  const { data, isLoading } = useQuery({
    queryKey: ["payment"],
    queryFn: fetchPosts,
  });

  //const [datak, setDatak] = useState(data);
  console.log(data);
  return (
    <div className="container mx-auto py-10">
      {isLoading ? (
        <Item>
          <ItemMedia>
            <Spinner></Spinner>
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Tablo Yükleniyor...</ItemTitle>
          </ItemContent>
        </Item>
      ) : (
        <DataTable columns={columns} data={data!}></DataTable>
      )}
    </div>
  );
}
