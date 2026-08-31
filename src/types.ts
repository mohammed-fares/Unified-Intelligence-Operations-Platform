export type Language = 'en' | 'ar';

export type TabType =
  | 'targets'
  | 'operations'
  | 'devices'
  | 'geoint'
  | 'location'
  | 'files'
  | 'commands'
  | 'c2'
  | 'dfd'
  | 'schema'
  | 'security'
  | 'audit';

export interface DeviceInfo {
  id: string;
  targetId: string;
  name: string;
  type: 'android' | 'laptop' | 'tablet';
  uuid: string;
  battery: number;
  signalStrength: number;
  status: 'online' | 'standby' | 'disconnected';
  lastSeen: string;
  ip: string;
  network: string;
  coords: { lat: number; lng: number; altitude: number; speed: number };
  cameraAvailable: ('front' | 'rear' | 'integrated')[];
  activeCamera: 'front' | 'rear' | 'integrated';
  permissions: {
    location: boolean;
    camera: boolean;
    audio: boolean;
    telemetry: boolean;
    files: boolean;
    keylogger: boolean;
  };
}

export interface TargetProfile {
  id: string;
  codeName: string;
  fullNameEn: string;
  fullNameAr: string;
  dob: string;
  nationalityEn: string;
  nationalityAr: string;
  passportId: string;
  nationalId: string;
  permanentAddressEn: string;
  permanentAddressAr: string;
  occupationEn: string;
  occupationAr: string;
  fusionScore: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'ACTIVE_MONITORING' | 'INTERCEPT_STANDBY' | 'FUSED' | 'ARCHIVED';
  devicesCount: number;
  lastSync: string;
  familyNetwork: {
    relationEn: string;
    relationAr: string;
    name: string;
    phone: string;
  }[];
  socialProfiles: {
    platform: string;
    handle: string;
    status: string;
  }[];
  aiInsights: {
    id: string;
    titleEn: string;
    titleAr: string;
    summaryEn: string;
    summaryAr: string;
    confidence: number;
    severity: 'info' | 'warning' | 'critical';
    timestamp: string;
  }[];
}

export interface IntelFeedItem {
  id: string;
  targetId: string;
  timestamp: string;
  type: 'SMS' | 'GEO_FENCE' | 'KEYLOG' | 'CALL' | 'APP_USAGE' | 'BROWSER' | 'FILE';
  titleEn: string;
  titleAr: string;
  contentEn: string;
  contentAr: string;
  severity: 'info' | 'warning' | 'critical';
  deviceId: string;
  tag: string;
}

export interface BehavioralMetric {
  titleEn: string;
  titleAr: string;
  value: number; // 0 - 100
  labelEn: string;
  labelAr: string;
  status: 'normal' | 'warning' | 'alert';
}

export interface AuditLog {
  id: string;
  timestamp: string;
  operatorId: string;
  action: string;
  targetDeviceId: string;
  legalWarrantRef: string;
  result: 'SUCCESS' | 'DENIED' | 'FLAGGED';
  ipAddress?: string;
  detailsEn?: string;
  detailsAr?: string;
}

export interface VaultFile {
  id: string;
  deviceId: string;
  targetId: string;
  name: string;
  path: string;
  size: string;
  type: 'doc' | 'image' | 'audio' | 'db' | 'archive' | 'code';
  encryption: 'AES-256-GCM' | 'PLAINTEXT';
  sha256: string;
  uploadedAt: string;
  status: 'synced' | 'pending' | 'quarantined';
  previewContent?: string;
}

export interface DeviceCommandRecord {
  id: string;
  timestamp: string;
  deviceId: string;
  targetId: string;
  operatorId: string;
  command: string;
  parameters: string;
  status: 'PENDING' | 'EXECUTING' | 'COMPLETED' | 'FAILED';
  executionTimeMs: number;
  output: string;
  signature: string;
}

// Database Schema Interfaces
export interface SchemaColumn {
  name: string;
  type: string;
  isPrimary?: boolean;
  isForeign?: boolean;
  references?: string;
  nullable: boolean;
  descriptionEn: string;
  descriptionAr: string;
}

export interface SchemaTable {
  id: string;
  name: string;
  functionEn: string;
  functionAr: string;
  relationshipsEn: string;
  relationshipsAr: string;
  recordCount: number;
  columns: SchemaColumn[];
  sampleData: Record<string, any>[];
}

// DFD Interfaces
export interface DFDNode {
  id: string;
  type: 'entity' | 'process' | 'store';
  code: string;
  titleEn: string;
  titleAr: string;
  descriptionEn: string;
  descriptionAr: string;
  connectedTo: string[];
  protocol?: string;
  dataPayloadEn: string;
  dataPayloadAr: string;
}
