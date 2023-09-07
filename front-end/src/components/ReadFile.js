import { useState } from "react";
import * as XLSX from "xlsx";
import { textEditor, Column } from "react-data-grid";

import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';

function ReadFile() {
  const [data, setData] = useState([]);
  const [validationErrors, setValidationErrors] = useState([]);

  const handleFileUpload = (e) => {
    const reader = new FileReader();
    reader.readAsBinaryString(e.target.files[0]);
    reader.onload = (e) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const parsedData = XLSX.utils.sheet_to_json(sheet);

      console.log(parsedData)
      
      const emptyFields = [];
      parsedData.forEach((row, rowIndex) => {
        for (const key in row) {
          if (row.hasOwnProperty(key)) {
            if (!row[key]) {
              emptyFields.push({ row: rowIndex + 2, column: key });
            }
          }
        }
      });

      console.log("Campos não preenchidos:", emptyFields);
      setData(parsedData);
    };
  }

  const handleValidation = () => {
    const errors = validateData(data);
    setValidationErrors(errors);
  }

  const validateData = (data) => {
    const errors = [];

    data.forEach((row, rowIndex) => {
      console.log(row)
      if (!row["product_code"]) {
        errors.push(`Campo "Código" ausente na linha ${rowIndex + 1}`);
      }

      // Adicione outras validações aqui
    });

    return errors;
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
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr key={index}>
                  {Object.values(row).map((value, index) => (
                    <td key={index}>{value}</td>
                  ))}
                  <td>
                    {/* Exiba os erros na coluna de erros */}
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
              <Button onClick={handleValidation}>Validar</Button>
            </ButtonGroup>
            <ButtonGroup className="me-2" aria-label="Second group">
              <Button variant="success">Atualizar</Button>
            </ButtonGroup>
          </ButtonToolbar>

        </Row>
      )}

    </Container>
  );
}

export default ReadFile;