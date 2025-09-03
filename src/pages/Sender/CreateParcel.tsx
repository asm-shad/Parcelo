import { useGetParcelQuery } from "@/redux/features/parcel/parcel.api";

const CreateParcel = () => {
  const { data } = useGetParcelQuery(undefined);
  console.log(data);
  return (
    <div>
      <h1>CreateParcel</h1>
    </div>
  );
};

export default CreateParcel;
