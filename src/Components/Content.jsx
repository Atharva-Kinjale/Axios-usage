
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { useEffect, useState } from "react";
import { Table, Form, Button, Pagination } from 'react-bootstrap';



const apiUrl = 'https://jsonplaceholder.typicode.com/albums';
const itemsPerPage = 10;
export default function Content() {
    const [albumsData, setAlbumsData] = useState([]);
    const [newTitle, setnewTitle] = useState('');
    const [selectedAlbum, setSelectedAlbum] = useState(null);
    const [updateAlbum, setUpdateAlbum] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    // // ------------------------------------------------------------------
    // useEffect(() => {
    //     axios.get(apiUrl).then((response) => {
    //         console.log(response.data);
    //         setAlbumsData(response.data)
    //     }
    //     )

    // }, []);
    // // ------------------------------------------------------------------

    useEffect(() => {
        async function fetchAlbum() {
            try {
                const response = await axios.get(apiUrl);
                setAlbumsData(response.data);
            }

            catch (error) {
                console.error('Error fetching data:', error);
            }
        }
        fetchAlbum();
    }, []);


    async function hanDleDelete(id) {
        try {
            await axios.delete(`${apiUrl}/${id}`)
            setAlbumsData(albumsData.filter(item => item.id !== id))

        } catch (error) {
            console.error('Error deleting data:', error);
        }
    }

    const addItem = async () => {
        try {
            await axios.post(apiUrl, { id: albumsData.length + 1, title: newTitle })
            if (newTitle.trim() === '') {

                return;
            }
            setAlbumsData([{ id: albumsData.length + 1, title: newTitle }, ...albumsData]);
            setnewTitle('');

        } catch (error) {
            console.error('Error adding data:', error);

        }
    };

    function handleEdit(item) {
        setSelectedAlbum(item);
        setUpdateAlbum(item.title);

    }

    const updateSelectedAlbumm = async () => {
        try {
            await axios.put(`${apiUrl}/${selectedAlbum.id} `)
            if (!selectedAlbum || updateAlbum.trim() === '') {
                return;
            }
            setAlbumsData(albumsData.map(item => item.id === selectedAlbum.id ? { ...item, title: updateAlbum } : item));
            setUpdateAlbum('');
            setSelectedAlbum(null);

        } catch (error) {
            console.error('Error updating data:', error);
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = albumsData.slice(indexOfFirstItem, indexOfLastItem);

    return (<div>
        {!selectedAlbum && <><Form.Group controlId="newItem">
            <Form.Label>Add New Title:</Form.Label>
            <Form.Control
                type="text"
                placeholder="Enter new title here..."
                value={newTitle}
                onChange={(e) => { setnewTitle(e.target.value); }}
            />

        </Form.Group>
            <br />
            <div className="d-grid gap-2">
                <Button variant="dark" size="lg" onClick={addItem}>Add Title</Button>
            </div>
        </>}
        {selectedAlbum && (
            <>
                <Form.Group controlId="updateItem">
                    <Form.Label>Update Title of Album:</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter updated title here..."
                        value={updateAlbum}
                        onChange={(e) => { setUpdateAlbum(e.target.value); }}
                    />
                </Form.Group>
                <br />
                <div className="d-grid gap-2">
                    <Button variant="dark" size="lg" onClick={updateSelectedAlbumm}>Update Title</Button>
                </div>
            </>
        )}


        {albumsData.length > 0 ? (
            <>
                {/* returning actual content in table format
        <div>titleof album</div>
        {albumsData.map((item) => (<div key={item.id}>{item.title}</div>))} */}
                <Table>
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Title</th>
                            <th>Edit</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((item) => (
                            <tr key={item.id}> {/* Use a unique identifier for each item */}
                                {/* Render table cells based on your data structure */}
                                <td>{item.id}</td>
                                <td>{item.title}</td>
                                <td><Button variant="primary" onClick={() => handleEdit(item)}>Edit</Button></td>
                                <td><Button variant="danger" onClick={() => hanDleDelete(item.id)}>Delete</Button></td>
                                {/* Add more cells as needed */}
                            </tr>
                        ))}
                    </tbody>
                </Table>

            </>
        ) : (
            <p>Loading data...</p>
        )}
        <Pagination className='justify-content-center'>
            {Array.from({ length: Math.ceil(albumsData.length / itemsPerPage) }, (_, i) => (
                <Pagination.Item key={i + 1} active={i + 1 === currentPage} onClick={() => handlePageChange(i + 1)}>
                    {i + 1}
                </Pagination.Item>
            ))}
        </Pagination>
    </div>);
}