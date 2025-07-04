# Lighthouse CI Setup

This project is configured with Lighthouse CI to automatically monitor web performance, accessibility, SEO, and best practices metrics in your continuous integration pipeline.

## 🚀 What's Included

### GitHub Actions Workflow

- **File**: `.github/workflows/lighthouse.yml`
- **Triggers**: Runs on push to `main`/`develop` branches and pull requests to `main`
- **Database**: Spins up PostgreSQL service for realistic testing
- **Pages Audited**:
  - Homepage (`/`)
  - Sign-in page (`/sign-in`)
  - Sign-up page (`/sign-up`)

### Performance Standards

- **Performance**: 80% minimum score (warns if below)
- **Accessibility**: 90% minimum score (fails if below)
- **Best Practices**: 80% minimum score (warns if below)
- **SEO**: 80% minimum score (warns if below)
- **PWA**: Disabled (not applicable for this project)

## 📊 How It Works

1. **Automatic Runs**: Every push and pull request triggers Lighthouse audits
2. **Multiple Runs**: Each page is audited 3 times for consistent results
3. **Public Reports**: Results are uploaded to temporary public storage
4. **CI Integration**: Builds fail if accessibility standards aren't met

## 🛠️ Local Development

### Run Lighthouse Locally

```bash
# Install dependencies (if not already installed)
npm install

# Run complete Lighthouse CI pipeline
npm run lighthouse

# Or run individual steps
npm run lighthouse:collect  # Collect performance data
npm run lighthouse:assert   # Check against assertions
```

### Prerequisites for Local Runs

- Application must be built: `npm run build`
- Database must be running: `npm run db:start`
- Environment variables must be set

## 📈 Understanding Results

### Performance Metrics

- **First Contentful Paint (FCP)**: Time to first content render
- **Largest Contentful Paint (LCP)**: Time to largest content render
- **Total Blocking Time (TBT)**: Time main thread is blocked
- **Cumulative Layout Shift (CLS)**: Visual stability measure
- **Speed Index**: How quickly content is visually displayed

### Accessibility Checks

- Color contrast ratios
- ARIA labels and roles
- Keyboard navigation
- Screen reader compatibility
- Form labeling
- Alternative text for images

### Best Practices

- HTTPS usage
- Browser error logging
- Image optimization
- Security headers
- Modern web standards compliance

## 🎯 Performance Budgets

The current configuration warns or fails builds based on these thresholds:

```json
{
  "performance": 80, // Warns if below 80%
  "accessibility": 90, // Fails if below 90%
  "best-practices": 80, // Warns if below 80%
  "seo": 80 // Warns if below 80%
}
```

## 📋 Customization

### Adding More Pages

Edit `lighthouserc.json` to audit additional pages:

```json
{
  "ci": {
    "collect": {
      "url": [
        "http://localhost:3000",
        "http://localhost:3000/sign-in",
        "http://localhost:3000/sign-up",
        "http://localhost:3000/dashboard",
        "http://localhost:3000/notes"
      ]
    }
  }
}
```

### Adjusting Performance Budgets

Modify the `assert.assertions` section in `lighthouserc.json`:

```json
{
  "assertions": {
    "categories:performance": ["error", { "minScore": 0.9 }],
    "categories:accessibility": ["error", { "minScore": 0.95 }]
  }
}
```

### Setting Up Lighthouse CI Server

For persistent result storage, consider setting up a Lighthouse CI server:

```json
{
  "ci": {
    "upload": {
      "target": "lhci",
      "serverBaseUrl": "https://your-lhci-server.com",
      "token": "your-server-token"
    }
  }
}
```

## 🔧 Troubleshooting

### Common Issues

1. **Database Connection Errors**

   - Ensure PostgreSQL service is running in CI
   - Check environment variables are set correctly

2. **Build Failures**

   - Verify all dependencies are installed
   - Check that the build completes successfully

3. **Lighthouse Timeouts**
   - Increase timeout in `lighthouserc.json`:
   ```json
   {
     "collect": {
       "settings": {
         "maxWaitForFcp": 30000,
         "maxWaitForLoad": 45000
       }
     }
   }
   ```

### Debug Mode

Enable debug output in GitHub Actions:

```yaml
- name: Run Lighthouse CI
  uses: treosh/lighthouse-ci-action@v12
  with:
    configPath: "./lighthouserc.json"
    temporaryPublicStorage: true
    runs: 3
  env:
    DEBUG: lhci*
```

## 📖 Reports

### Viewing Results

- **Pull Requests**: Lighthouse bot comments with results
- **GitHub Actions**: View detailed logs in the Actions tab
- **Public Storage**: Temporary links to full reports

### Sample Report Structure

```
📊 Lighthouse Report
├── 📈 Performance: 85/100
├── ♿ Accessibility: 95/100
├── 🔧 Best Practices: 88/100
├── 🔍 SEO: 82/100
└── 📱 PWA: N/A
```

## 🚀 Next Steps

1. **Monitor Trends**: Review reports regularly to catch performance regressions
2. **Set Stricter Budgets**: Gradually increase performance thresholds
3. **Add More Pages**: Include authenticated routes and complex interactions
4. **Setup Alerts**: Configure notifications for failed builds
5. **Performance Optimization**: Address issues found in reports

## 📚 Resources

- [Lighthouse Documentation](https://developers.google.com/web/tools/lighthouse)
- [Lighthouse CI Documentation](https://github.com/GoogleChrome/lighthouse-ci)
- [Web.dev Performance Guides](https://web.dev/learn-web-vitals/)
- [Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

The Lighthouse CI setup helps maintain high-quality standards for your web application by automatically catching performance and accessibility issues before they reach production.
