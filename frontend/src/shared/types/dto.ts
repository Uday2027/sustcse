export interface RegisterStudentDTO {
  full_name: string;
  student_id: string;
  email: string;
  session: string;
  phone: string;
  password: string;
  confirm_password: string;
}

export interface RegisterTeacherDTO {
  full_name: string;
  email: string;
  phone: string;
  password: string;
  confirm_password: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CostRequestDTO {
  fiscal_year_id: string;
  title: string;
  description?: string;
  amount: number;
  category?: string;
  proof_urls: string[];
}

export interface ApprovalDTO {
  remarks?: string;
}

export interface CheckNumberDTO {
  check_number: string;
  check_date: string;
}
