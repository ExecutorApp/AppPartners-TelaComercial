import React from 'react';
import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import NewSaleSalesContractPDF from '../10.Vendas/02.06.NewSale-SalesContract-PDF';

export async function downloadSalesContract(sourceUri?: string): Promise<void> {
  const filename = 'Contrato-de-venda.pdf';
  if (Platform.OS === 'web') {
    const base64 =
      'JVBERi0xLjQKJcTl8uXrCjEgMCBvYmoKPDwKL1BhZ2VzIDIgMCBSCj4+CmVuZG9iagoyIDAgb2JqCjw8Ci9LaWRzIFsgMyAwIFIgXQovQ291bnQgMQo+PgplbmRvYmoKMyAwIG9iago8PAovVHlwZSAvUGFnZQovTWVkaWFCb3ggWzAgMCA1OTUgODQxXQovQ29udGVudHMgNCAwIFIKPj4KZW5kb2JqCjQgMCBvYmoKPDwKL0xlbmd0aCA1Nwo+PgpzdHJlYW0KQlQKL0YxMiBUZgovMjQ2IDQyMiBUZAooQ29udHJhdG8gZGUgdmVuZGEpIFQKRVQKZW5kc3RyZWFtCmVuZG9iagp4cmVmCjAgNQowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAxMDUgMDAwMDAgbiAKMDAwMDAwMDE4MSAwMDAwMCBuIAowMDAwMDAwMzQyIDAwMDAwIG4gCjAwMDAwMDA0MjAgMDAwMDAgbiAKdHJhaWxlcgo8PAovUm9vdCAxIDAgUgovU2l6ZSA1Cj4+CnN0YXJ0eHJlZgo0OTYKJSVFT0YK';
    const link = document.createElement('a');
    link.href = `data:application/pdf;base64,${base64}`;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return;
  }
  const dest = `${FileSystem.documentDirectory}${filename}`;
  if (sourceUri) {
    const result = await FileSystem.downloadAsync(sourceUri, dest);
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(result.uri, { mimeType: 'application/pdf' });
    }
    return;
  }
  const base64 =
    'JVBERi0xLjQKJcTl8uXrCjEgMCBvYmoKPDwKL1BhZ2VzIDIgMCBSCj4+CmVuZG9iagoyIDAgb2JqCjw8Ci9LaWRzIFsgMyAwIFIgXQovQ291bnQgMQo+PgplbmRvYmoKMyAwIG9iago8PAovVHlwZSAvUGFnZQovTWVkaWFCb3ggWzAgMCA1OTUgODQxXQovQ29udGVudHMgNCAwIFIKPj4KZW5kb2JqCjQgMCBvYmoKPDwKL0xlbmd0aCA1Nwo+PgpzdHJlYW0KQlQKL0YxMiBUZgovMjQ2IDQyMiBUZAooQ29udHJhdG8gZGUgdmVuZGEpIFQKRVQKZW5kc3RyZWFtCmVuZG9iagp4cmVmCjAgNQowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAxMDUgMDAwMDAgbiAKMDAwMDAwMDE4MSAwMDAwMCBuIAowMDAwMDAwMzQyIDAwMDAwIG4gCjAwMDAwMDA0MjAgMDAwMDAgbiAKdHJhaWxlcgo8PAovUm9vdCAxIDAgUgovU2l6ZSA1Cj4+CnN0YXJ0eHJlZgo0OTYKJSVFT0YK';
  await FileSystem.writeAsStringAsync(dest, base64, { encoding: FileSystem.EncodingType.Base64 });
  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(dest, { mimeType: 'application/pdf' });
  }
}

export interface SalesContractViewerProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
}

export const SalesContractViewer: React.FC<SalesContractViewerProps> = ({ visible, onClose, title }) => {
  return <NewSaleSalesContractPDF visible={visible} onClose={onClose} title={title ?? 'Contrato de venda'} />;
};
