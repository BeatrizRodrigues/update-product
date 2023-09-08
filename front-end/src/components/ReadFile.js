import { useState } from "react";
import * as XLSX from "xlsx";
import api from '../utils/api'


import styles from './ReadFile.css'

import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import Toast from 'react-bootstrap/Toast';

function ReadFile() {
  const [data, setData] = useState([]);
  const [validationErrors, setValidationErrors] = useState([]);
  const [isUpdateEnabled, setIsUpdateEnabled] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState(""); 

  async function updatePrice(data) {
    try {
      const updatedData = await Promise.all(

        data.map(async (row) => {


          const response = await api.patch(`/products/updatePrice`, row).catch((error) => {
            console.log(error)
          })

          return response.data;
        })
      );
      console.log("Dados atualizados:", updatedData);
      setNotificationMessage("Atualização concluída com sucesso!");
      setShowNotification(true);
    } catch (error) {
      console.error("Erro ao atualizar preços:", error);
      setNotificationMessage("Erro ao atualizar preços");
      setShowNotification(true);
    }
  }


  const handleFileUpload = (e) => {
    const reader = new FileReader();
    reader.readAsBinaryString(e.target.files[0]);
    reader.onload = (e) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const parsedData = XLSX.utils.sheet_to_json(sheet);

      setData(parsedData);
    };
  }

  const handleValidation = () => {
    setValidationErrors([]);
    validateData(data);
  }

  const handleUpdate = () => {
    updatePrice(data);
  }

  const validateData = async (data) => {
    const errors = [];

    const validationPromises = data.map(async (row, rowIndex) => {
      console.log(row)
      if (!row.product_code || !row.new_price) {
        errors[rowIndex] = [`Linha ${rowIndex + 1}: Campos necessários ausentes`];
      } else {

        try {
          const response = await api.get(`/products/${row.product_code}`);

          if (!response.data.products) {
            errors[rowIndex] = [`Linha ${rowIndex + 1}: Produto não existe`];
          } else {
            const product = response.data.products;

            if (product.cost_price > row.new_price) {
              errors.push(`Linha ${rowIndex + 1}: Preço de venda menor que preço de custo`);
            }

            if (!Number.isInteger(row.product_code) || Number.isNaN(row.new_price)) {
              errors.push(`Linha ${rowIndex + 1}: Valores não numericos`);
            }

            var resultadoMaior = parseFloat(response.data.products.sales_price) + (0.1 * response.data.products.sales_price)
            var resultadoMenor = parseFloat(response.data.products.sales_price) - (0.1 * response.data.products.sales_price)

            if (row.new_price > resultadoMaior.toFixed(2) || row.new_price < resultadoMenor.toFixed(2)) {
              errors[rowIndex] = [`Linha ${rowIndex + 1}: Ajuste menor ou maior que 10% do valor atual`];
            }

          }
        } catch (error) {
          console.log("Erro ao buscar informações do produto", error);
        }
      }

    });

    await Promise.all(validationPromises);

    // Atualize o estado das mensagens de validação
    setValidationErrors(errors);

    // Verifique se o botão "Atualizar" deve ser habilitado
    setIsUpdateEnabled(errors.length === 0);

    console.log("Erros:", errors);
  }

  return (
    <Container className="ReadFile">

      <Row className="justify-content-md-center">
        <Col xs lg="8">
          <Form.Group controlId="formFile" className="mb-3">
            <Form.Label>Escolha um arquivo</Form.Label>
            <Form.Control type="file" accept=".xlsx, .xls, .csv" onChange={handleFileUpload} />
          </Form.Group>
        </Col>
      </Row>

      {data.length > 0 && (
        <Row className="justify-content-md-center">
          <Col xs lg="8"><Table className="table">
            <thead>
              <tr>
                {Object.keys(data[0]).map((key) => (
                  <th key={key}>{key}</th>
                ))}
                <th>#</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr key={index} className={validationErrors[index] ? styles.error - row : ''}>
                  {Object.values(row).map((value, index) => (
                    <td key={index}>{value} </td>
                  ))}

                  <td>
                    {validationErrors[index] && (
                      <ul>
                        {validationErrors[index].map((error, errorIndex) => (
                          <li key={errorIndex}>{error}</li>
                        ))}
                      </ul>
                    )}
                  </td>

                </tr>
              ))}
            </tbody>
          </Table>
          </Col>
          <ButtonToolbar className="justify-content-center" aria-label="Toolbar with button groups">
            <ButtonGroup className="me-2" aria-label="First group">
              <Button onClick={handleValidation} >Validar</Button>
            </ButtonGroup>
            <ButtonGroup className="me-2" aria-label="Second group">
              <Button onClick={handleUpdate} variant="success" disabled={!isUpdateEnabled}>Atualizar</Button>
            </ButtonGroup>
          </ButtonToolbar>

        </Row>
      )}

      <Toast
        show={showNotification}
        onClose={() => setShowNotification(false)}
        delay={3000} // Tempo que a notificação ficará visível (em milissegundos)
        autohide
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
        }}
      >
        <Toast.Header>
          {/* Você pode personalizar o cabeçalho da notificação aqui */}
          <strong className="me-auto">Notificação</strong>
        </Toast.Header>
        <Toast.Body>{notificationMessage}</Toast.Body>
      </Toast>

    </Container>
  );
}

export default ReadFile;