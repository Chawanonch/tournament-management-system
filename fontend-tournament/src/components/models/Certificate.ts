export interface Certificate {
  id: number; // Id
  name: string; // ชื่อรายการ
  rank: string; // รางวัล
  teamId: number;
  image: string;
  certificateNumber: number;
  dateTime: string;
  textInImageId: number;
  listSignerDetails: [
    {
      id: number;
      signerDetailId: number;
      certificateId: number;
    }
  ];
}

export interface TextInImage {
  id: number;
  text: string;
}

export interface SignerDetail {
  id: number;
  fullName: string;
  position: string;
  signatureImageUrl: string;
}
