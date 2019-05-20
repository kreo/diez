# coding: utf-8
version = '1.0.0'

Pod::Spec.new do |s|
  s.name = '{{{moduleName}}}'
  s.version = version
  s.summary = 'Diez Design System'
  s.description = <<-DESC
                    Diez design system.
                  DESC
  s.license = 'MIT'
  s.author = 'Diez'
  s.homepage = 'https://diez.org'
  s.source = { :git => 'https://github.com/diez/diez' }
  # TODO: What are these, actually?
  s.platforms = { :ios => '12.1' }
  # TODO: Support new Lottie iOS
  {{#each dependencies}}
  s.dependency '{{{this.cocoapods.name}}}', '{{{this.cocoapods.versionConstraint}}}'
  {{/each}}
  s.source_files = 'Sources/SDK.swift'
  s.framework = 'UIKit', 'WebKit'
  # TODO: s.ios.source_files and s.ios.framework for iOS, s.osx.* for macOS, and so on
  {{#if hasStaticAssets}}
  s.resource_bundles = {
    'Static' => ['static/**']
  }
  {{/if}}
end