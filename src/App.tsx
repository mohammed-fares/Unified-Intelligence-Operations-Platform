/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Language, TabType, DeviceInfo, IntelFeedItem, TargetProfile } from './types';
import { mockTarget, mockTargets, mockDevices, mockIntelFeed, mockBehavioralMetrics } from './data/mockData';
import { Header } from './components/Header';
import { TargetDirectoryView } from './components/TargetDirectoryView';
import { TargetContextBar } from './components/TargetContextBar';
import { IdentityCard } from './components/IdentityCard';
import { IntelFeed } from './components/IntelFeed';
import { TacticalRadarMap } from './components/TacticalRadarMap';
import { MediaSurveillance } from './components/MediaSurveillance';
import { ControlTerminal } from './components/ControlTerminal';
import { BehavioralAnalytics } from './components/BehavioralAnalytics';
import { IdentityFusionModal } from './components/IdentityFusionModal';
import { DeviceFleetModal } from './components/DeviceFleetModal';
import { TargetSidebar } from './components/TargetSidebar';
import { DataFlowDiagramView } from './components/DataFlowDiagramView';
import { DatabaseSchemaView } from './components/DatabaseSchemaView';
import { SecurityProtocolView } from './components/SecurityProtocolView';
import { FileManagerView } from './components/FileManagerView';
import { CommandConsoleView } from './components/CommandConsoleView';
import { DeviceFleetView } from './components/DeviceFleetView';
import { GeospatialTrackingView } from './components/GeospatialTrackingView';
import { Footer } from './components/Footer';

export default function App() {
  const [lang, setLang] = useState<Language>('ar');
  const [activeTab, setActiveTab] = useState<TabType>('targets');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [targetsList, setTargetsList] = useState<TargetProfile[]>(mockTargets);
  const [activeTargetId, setActiveTargetId] = useState<string>('0912');
  const [activeDeviceId, setActiveDeviceId] = useState<string>('dev-01');
  const [showFusionModal, setShowFusionModal] = useState<boolean>(false);
  const [showDevicesModal, setShowDevicesModal] = useState<boolean>(false);
  const [intelFeed, setIntelFeed] = useState<IntelFeedItem[]>(mockIntelFeed);

  const activeTarget: TargetProfile =
    targetsList.find((t) => t.id === activeTargetId) || targetsList[0] || mockTarget;

  // Find target-specific devices or fallback to all mockDevices
  const targetDevices = mockDevices.filter((d) => d.targetId === activeTarget.id);
  const effectiveDevices = targetDevices.length > 0 ? targetDevices : mockDevices;

  const activeDevice =
    effectiveDevices.find((d) => d.id === activeDeviceId) || effectiveDevices[0] || mockDevices[0];

  const handleSelectTargetAndNavigate = (targetId: string, targetTab: TabType = 'operations') => {
    setActiveTargetId(targetId);
    const targetFirstDev = mockDevices.find((d) => d.targetId === targetId);
    if (targetFirstDev) {
      setActiveDeviceId(targetFirstDev.id);
    }
    setActiveTab(targetTab);
  };

  const isAr = lang === 'ar';

  const isTargetSpecificView = [
    'operations',
    'location',
    'files',
    'c2',
    'devices',
  ].includes(activeTab);

  return (
    <div
      dir={isAr ? 'rtl' : 'ltr'}
      className="min-h-screen bg-[#050608] text-[#94a3b8] font-sans flex flex-col p-3 md:p-4 selection:bg-cyan-500/30 selection:text-cyan-200"
    >
      {/* Top Header Navigation */}
      <Header
        lang={lang}
        setLang={setLang}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        onOpenFusion={() => setShowFusionModal(true)}
        onOpenDevices={() => setShowDevicesModal(true)}
        activeTargetCodeName={activeTarget.codeName}
      />

      {/* Dynamic Content Views */}
      <main className="flex-1 flex flex-col gap-4">
        {/* VIEW 0: MAIN DASHBOARD LANDING PAGE - Target & Person Intelligence Directory */}
        {activeTab === 'targets' && (
          <TargetDirectoryView
            targets={targetsList}
            devices={mockDevices}
            lang={lang}
            onSelectTargetAndNavigate={handleSelectTargetAndNavigate}
            onOpenFusionModal={(t) => {
              setActiveTargetId(t.id);
              setShowFusionModal(true);
            }}
            onOpenDevicesModal={(t) => {
              setActiveTargetId(t.id);
              setShowDevicesModal(true);
            }}
            onAddNewTarget={(newT) => {
              setTargetsList((prev) => [newT, ...prev]);
            }}
          />
        )}

        {/* If in a target-specific view, show Target Context Ribbon */}
        {isTargetSpecificView && (
          <TargetContextBar
            activeTarget={activeTarget}
            targets={targetsList}
            devices={mockDevices}
            lang={lang}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onBackToDirectory={() => setActiveTab('targets')}
            onSwitchTarget={(id) => {
              setActiveTargetId(id);
              const tDev = mockDevices.find((d) => d.targetId === id);
              if (tDev) setActiveDeviceId(tDev.id);
            }}
            onOpenFusion={() => setShowFusionModal(true)}
            onOpenDevices={() => setShowDevicesModal(true)}
          />
        )}

        {/* VIEW 1: Operational Command Grid for Active Target */}
        {activeTab === 'operations' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1">
            {/* Left Column (col-span-3): Target Profile & Extracted Intel Feed */}
            <aside className="lg:col-span-3 flex flex-col gap-4">
              <IdentityCard
                target={activeTarget}
                lang={lang}
                onOpenFusion={() => setShowFusionModal(true)}
                onOpenDevices={() => setShowDevicesModal(true)}
              />
              <IntelFeed
                items={intelFeed.filter((f) => !f.targetId || f.targetId === activeTarget.id)}
                lang={lang}
                onSelectItem={(item) => {
                  setActiveDeviceId(item.deviceId);
                }}
              />
            </aside>

            {/* Center Column (col-span-6): GEOINT Radar Map & Audio/Video Surveillance */}
            <section className="lg:col-span-6 flex flex-col gap-4">
              <TacticalRadarMap
                devices={effectiveDevices}
                lang={lang}
                activeDeviceId={activeDeviceId}
                onSelectDevice={(id) => setActiveDeviceId(id)}
              />
              <MediaSurveillance device={activeDevice} lang={lang} />
            </section>

            {/* Right Column (col-span-3): Control Terminal & Behavioral AI Analytics */}
            <aside className="lg:col-span-3 flex flex-col gap-4">
              <ControlTerminal
                device={activeDevice}
                lang={lang}
                onExecuteCommand={(cmd) => {
                  if (cmd.toLowerCase().includes('diag') || cmd.toLowerCase().includes('sync')) {
                    const newItem: IntelFeedItem = {
                      id: `feed-${Date.now()}`,
                      targetId: activeTarget.id,
                      timestamp: new Date().toTimeString().split(' ')[0],
                      type: 'APP_USAGE',
                      titleEn: 'TERMINAL ACTION LOGGED',
                      titleAr: 'تم تسجيل إجراء من الطرفية',
                      contentEn: `Executed "${cmd}" on ${activeDevice.name}`,
                      contentAr: `تم تنفيذ «${cmd}» على ${activeDevice.name}`,
                      severity: 'info',
                      deviceId: activeDevice.id,
                      tag: 'EXEC',
                    };
                    setIntelFeed((prev) => [newItem, ...prev]);
                  }
                }}
              />
              <BehavioralAnalytics metrics={mockBehavioralMetrics} lang={lang} />
            </aside>
          </div>
        )}

        {/* VIEW 2: Data Flow Diagram (DFD) */}
        {activeTab === 'dfd' && <DataFlowDiagramView lang={lang} />}

        {/* VIEW 3: Relational Database Schema Explorer (14 Tables, DDL & ERD) */}
        {activeTab === 'schema' && <DatabaseSchemaView lang={lang} />}

        {/* VIEW 4: Zero-Trust Security Protocol & Encryption Suite */}
        {(activeTab === 'security' || activeTab === 'audit') && <SecurityProtocolView lang={lang} />}

        {/* VIEW 5: Geospatial Radar & Breadcrumb Tracking for Active Target */}
        {activeTab === 'location' && (
          <GeospatialTrackingView
            activeTarget={activeTarget}
            devices={effectiveDevices}
            lang={lang}
          />
        )}

        {/* VIEW 6: Encrypted File Vault & Remote FS for Active Target */}
        {activeTab === 'files' && (
          <FileManagerView
            activeTarget={activeTarget}
            devices={effectiveDevices}
            lang={lang}
          />
        )}

        {/* VIEW 7: Command & Control (C2) Console for Active Target */}
        {activeTab === 'c2' && (
          <CommandConsoleView
            activeTarget={activeTarget}
            devices={effectiveDevices}
            lang={lang}
          />
        )}

        {/* VIEW 8: Device Fleet & Sensor Relays Hub for Active Target */}
        {activeTab === 'devices' && (
          <DeviceFleetView
            activeTarget={activeTarget}
            devices={effectiveDevices}
            lang={lang}
          />
        )}
      </main>

      {/* Bottom Telemetry Footer */}
      <Footer lang={lang} />

      {/* Modals */}
      {showFusionModal && (
        <IdentityFusionModal
          target={activeTarget}
          lang={lang}
          onClose={() => setShowFusionModal(false)}
        />
      )}

      {showDevicesModal && (
        <DeviceFleetModal
          devices={effectiveDevices}
          lang={lang}
          activeDeviceId={activeDeviceId}
          onSelectDevice={(id) => setActiveDeviceId(id)}
          onClose={() => setShowDevicesModal(false)}
        />
      )}
    </div>
  );
}
