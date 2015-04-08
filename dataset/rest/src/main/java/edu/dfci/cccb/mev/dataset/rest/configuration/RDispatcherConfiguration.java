/**
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
package edu.dfci.cccb.mev.dataset.rest.configuration;

import static org.springframework.beans.factory.config.ConfigurableBeanFactory.SCOPE_PROTOTYPE;

import java.io.InputStream;
import java.net.InetSocketAddress;
import java.util.Arrays;
import java.util.Collection;
import java.util.Iterator;

import lombok.extern.log4j.Log4j;

import org.apache.commons.configuration.ConfigurationException;
import org.apache.commons.configuration.PropertiesConfiguration;
import org.springframework.beans.factory.config.AutowireCapableBeanFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Scope;

import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.Module;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.module.SimpleModule;

import edu.dfci.cccb.mev.dataset.domain.contract.Dataset;
import edu.dfci.cccb.mev.dataset.domain.r.RDispatcher;
import edu.dfci.cccb.mev.dataset.domain.r.RserveDatasetDeserializer;
import edu.dfci.cccb.mev.dataset.domain.r.RserveDatasetSerializer;
import edu.dfci.cccb.mev.dataset.domain.r.RserveDoubleDeserializer;
import edu.dfci.cccb.mev.dataset.domain.r.RserveDoubleSerializer;
import edu.dfci.cccb.mev.dataset.domain.r.annotation.Rserve;

/**
 * @author levk
 * 
 */
@Configuration
@Log4j
public class RDispatcherConfiguration {
  {
    log.info ("Configuring RDispatcher");
  }

  @Bean
  @Rserve
  public int concurrency () throws ConfigurationException {
    final PropertiesConfiguration config = new PropertiesConfiguration ();
    InputStream configurationStream = getClass ().getResourceAsStream ("/rserve.properties");
    if (configurationStream != null)
      config.load (configurationStream);
    else
      config.setProperty ("rserve.concurrency", "2");
    log.info ("RDispatcher with concurrency " + config.getInt ("rserve.concurrency"));
    return config.getInt ("rserve.concurrency");
  }

  @Bean
  @Rserve
  public Module rserveDatasetSerializationModule (final AutowireCapableBeanFactory factory) {
    log.info ("Configuring Rserve json serialization");
    return new SimpleModule () {
      private static final long serialVersionUID = 1L;

      {
        addSerializer (Dataset.class, new RserveDatasetSerializer ());
        addSerializer (Double.class, new RserveDoubleSerializer ());

        addDeserializer (Double.class, new RserveDoubleDeserializer ());
        addDeserializer (Dataset.class, new RserveDatasetDeserializer ());
      }

      private void inject (Object instance) {
        factory.autowireBean (instance);
      }

      @Override
      public <T> SimpleModule addSerializer (Class<? extends T> type, JsonSerializer<T> ser) {
        inject (ser);
        return super.addSerializer (type, ser);
      }

      @Override
      public <T> SimpleModule addDeserializer (Class<T> type, JsonDeserializer<? extends T> deser) {
        inject (deser);
        return super.addDeserializer (type, deser);
      }
    };
  }

  @Bean
  @Rserve
  public ObjectMapper mapper (@Rserve Collection<Module> modules) {
    return new ObjectMapper ().registerModules (modules);
  }

  @Bean
  @Rserve
  public RDispatcher r () {
    log.info ("Supplying RDispatcher in default scope");
    return new RDispatcher ();
  }

  @Bean
  @Rserve
  public Iterator<InetSocketAddress> hosts () throws ConfigurationException {
    final PropertiesConfiguration config = new PropertiesConfiguration ();
    InputStream configurationStream = getClass ().getResourceAsStream ("/rserve.properties");
    if (configurationStream != null)
      config.load (configurationStream);
    else
      config.setProperty ("rserve.host", "localhost:6311");

    final String[] hosts = config.getStringArray ("rserve.host");
    log.info ("Configuring RDispatcher with hosts " + Arrays.asList (hosts));
    final InetSocketAddress[] socks = new InetSocketAddress[hosts.length];
    for (int i = socks.length; --i >= 0;) {
      String[] split = hosts[i].split (":");
      socks[i] = new InetSocketAddress (split[0], split.length > 1 ? Integer.parseInt (split[1]) : 6311);
    }

    return new Iterator<InetSocketAddress> () {
      private int index = 0;

      @Override
      public boolean hasNext () {
        return true;
      }

      @Override
      public InetSocketAddress next () {
        if (index >= socks.length)
          index = 0;
        return socks[index++];
      }

      @Override
      public void remove () {}
    };
  }

  @Bean
  @Rserve
  @Scope (SCOPE_PROTOTYPE)
  public InetSocketAddress host (Iterator<InetSocketAddress> hosts) {
    return hosts.next ();
  }
}