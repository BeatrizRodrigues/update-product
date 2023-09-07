import api from '../utils/api'
import { useState, useEffect } from 'react'

import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';

function MyProducts() {
    const [products, setProducts] = useState([])

    useEffect(() => {
        api
            .get('/products/', {})
            .then((response) => {
                setProducts(response.data.products)
            })
    })

    return (
        <Container>
            <Row className="justify-content-md-center">
                <Col xs lg="8">
                    {products.length > 0 && (
                        <Table className="table">
                            <thead>
                                <tr>
                                    {Object.keys(products[0]).map((key) => (
                                        <th key={key}>{key}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((row, index) => (
                                    <tr key={index}>
                                        {Object.values(row).map((value, index) => (
                                            <td key={index}>{value}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}
                </Col>
            </Row>

            <Row>
                <Col>
                    <ButtonToolbar className="justify-content-center" aria-label="Toolbar with button groups">
                        <ButtonGroup className="me-2" aria-label="First group">
                            <Button>Cadastrar Pacote</Button>
                        </ButtonGroup>
                        <ButtonGroup className="me-2" aria-label="Second group">
                            <Button variant="success">Cadastrar Produto</Button>
                        </ButtonGroup>
                    </ButtonToolbar>
                </Col>
            </Row>
        </Container>

    )
}

export default MyProducts;