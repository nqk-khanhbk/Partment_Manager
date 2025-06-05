import { Box } from '@mui/material';

import './Class.css';
import ClassTable from '../../components/Table';
// import CustomTable from '../../components/customtable';
import { dataTitle, data} from '../../data/feckdata';
import HeaderClassManager from '../../components/headerClass';
// const columns1 = dataTitle1;
const columns = dataTitle; 
const rows = data;
const ClassRoom = () => {
    return (

        <>
            {/* phần header */}
            <HeaderClassManager />
            {/* <ClassTable /> */}
            <Box padding="12px" gap="12px" borderRadius="8px" backgroundColor="#fff" marginTop="20px">
                <ClassTable  columns={columns} rows={rows} allowSearching  />
                {/* <ClassTable columns={columns1} rows={rows} allowSearching /> 
                <ClassTable columns={dataTitle2} rows={data2}/> */}
                
            </Box>


            

        </>
    )
}
export default ClassRoom;